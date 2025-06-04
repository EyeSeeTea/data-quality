import { D2Api, D2TrackerEvent, DataValue } from "$/types/d2-api";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { Future } from "$/domain/entities/generic/Future";
import { logger } from "$/utils/logger";
import { MetadataItem } from "$/domain/entities/MetadataItem";
import _ from "$/domain/entities/generic/Collection";
import { Id } from "$/domain/entities/Ref";
import { D2DataElement } from "$/data/common/D2DataElement";
import { D2CategoryOption } from "$/data/common/D2CategoryOption";
import { D2OrgUnit } from "$/data/common/D2Country";
import { D2User } from "$/data/common/D2User";
import { Module } from "$/domain/entities/Module";
import { Country } from "$/domain/entities/Country";
import { DataElement } from "$/domain/entities/DataElement";
import { CategoryOption } from "$/domain/entities/CategoryOption";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { Maybe } from "$/utils/ts-utils";
import { IssueAction } from "$/domain/entities/IssueAction";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import { getDefaultModules } from "$/data/common/D2Module";
import {
    buildTrackerEventsResponse,
    buildTrackerResponse,
    getProgramStageIndexById,
} from "$/data/common/utils";

export class IssueD2Repository implements IssueRepository {
    d2DataElement: D2DataElement;
    d2CategoryOption: D2CategoryOption;
    d2OrgUnit: D2OrgUnit;
    d2User: D2User;
    allowedModules: Module[];

    constructor(private api: D2Api, private metadata: MetadataItem) {
        this.d2DataElement = new D2DataElement(this.api);
        this.d2CategoryOption = new D2CategoryOption(this.api);
        this.d2OrgUnit = new D2OrgUnit(this.api);
        this.d2User = new D2User(this.api);
        this.allowedModules = getDefaultModules(this.metadata);
    }

    get(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        const { filters, pagination } = options;
        const filtersParams = this.buildFilters(options.filters);
        return apiToFuture(
            this.api.tracker.events.get({
                programStage: filters.sectionId ? filters.sectionId : undefined,
                fields: { dataValues: true, event: true, programStage: true },
                totalPages: true,
                trackedEntity: filters.analysisIds ? filters.analysisIds.join(";") : undefined,
                page: pagination.page,
                pageSize: pagination.pageSize,
                // TODO: order and filter does not work together
                // ERROR: Query failed because of a syntax error (SqlState: 42703)",
                // disabling order if any filter is present
                order: filtersParams
                    ? undefined
                    : `${this.getDataElementIdOrThrow("sectionNumber")}:asc,${this.buildOrder(
                          options.sorting
                      )}`,
                filter: filtersParams,
                event: filters.id ? filters.id : undefined,
            })
        ).flatMap(d2Response => {
            const instances = buildTrackerEventsResponse(d2Response).instances;
            const orgUnitIds = this.getRelatedIdsFromDataValues(
                instances,
                this.getDataElementIdOrThrow("country")
            );
            const dataElementIds = this.getRelatedIdsFromDataValues(
                instances,
                this.getDataElementIdOrThrow("dataElement")
            );
            const categoryOptionIds = this.getRelatedIdsFromDataValues(
                instances,
                this.getDataElementIdOrThrow("categoryOption")
            );
            return Future.joinObj({
                countries: this.d2OrgUnit.getByIds(orgUnitIds),
                dataElements: this.d2DataElement.getByIds(dataElementIds),
                categoryOptions: this.d2CategoryOption.getByIds(categoryOptionIds),
            }).flatMap(({ countries, dataElements, categoryOptions }) => {
                return Future.success({
                    pagination: {
                        pageSize: d2Response.pageSize,
                        // @ts-ignore
                        pageCount: d2Response.pageCount,
                        page: d2Response.page,
                        total: d2Response.total || 0,
                    },
                    rows: this.buildIssues(instances, countries, dataElements, categoryOptions),
                });
            });
        });
    }

    getById(id: Id): FutureData<QualityAnalysisIssue> {
        return apiToFuture(
            this.api.tracker.events.get({
                fields: { dataValues: true, event: true, programStage: true },
                event: id ? id : undefined,
            })
        ).flatMap(d2Response => {
            const d2Event = buildTrackerEventsResponse(d2Response).instances[0];
            if (!d2Event) return Future.error(new Error(`Cannot found event: ${id}`));

            const orgUnitIds = this.getRelatedIdsFromDataValues(
                [d2Event],
                this.getDataElementIdOrThrow("country")
            );
            const dataElementIds = this.getRelatedIdsFromDataValues(
                [d2Event],
                this.getDataElementIdOrThrow("dataElement")
            );
            const categoryOptionIds = this.getRelatedIdsFromDataValues(
                [d2Event],
                this.getDataElementIdOrThrow("categoryOption")
            );
            return Future.joinObj({
                countries: this.d2OrgUnit.getByIds(orgUnitIds),
                dataElements: this.d2DataElement.getByIds(dataElementIds),
                categoryOptions: this.d2CategoryOption.getByIds(categoryOptionIds),
            }).flatMap(({ countries, dataElements, categoryOptions }) => {
                const issues = this.buildIssues(
                    [d2Event],
                    countries,
                    dataElements,
                    categoryOptions
                );
                const firstIssue = _(issues).first();
                if (!firstIssue) return Future.error(new Error(`Cannot found event: ${id}`));
                return Future.success(firstIssue);
            });
        });
    }

    create(issue: QualityAnalysisIssue, analysisId: Id): FutureData<void> {
        const programStageId = issue.type;
        if (!programStageId)
            return Future.error(new Error(`Cannot found programStage: ${programStageId}`));

        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                ouMode: "ALL",
                fields: { trackedEntity: true, enrollments: true },
                program: this.metadata.programs.qualityIssues.id,
                trackedEntity: analysisId,
            })
        ).flatMap(d2Response => {
            const instances = buildTrackerResponse(d2Response).instances;
            const tei = instances.find(tei => tei.trackedEntity === analysisId);
            if (!tei) return Future.error(new Error(`Cannot found TEI: ${tei}`));
            const enrollment = _(tei.enrollments || []).first();
            if (!enrollment)
                return Future.error(new Error(`Cannot found Enrollment in TEI: ${tei}`));

            const programStageIndex = getProgramStageIndexById(issue.type, this.metadata);

            return Future.fromPromise(
                logger.info({
                    config: {
                        trackedEntityId: analysisId,
                        programStageId: programStageId,
                        enrollmentId: enrollment.enrollment,
                    },
                    messages: [
                        {
                            id: this.metadata.dataElements.correlative.id,
                            value: issue.correlative,
                        },
                        {
                            id: this.metadata.dataElements.status.id,
                            value: issue.status?.code || "",
                        },
                        {
                            id: this.metadata.dataElements.issueNumber.id,
                            value: issue.number,
                        },
                        {
                            id: this.metadata.dataElements.country.id,
                            value: issue.country?.id || "",
                        },
                        {
                            id: this.metadata.dataElements.description.id,
                            value: issue.description,
                        },
                        {
                            id: this.metadata.dataElements.action.id,
                            value: issue.action?.code || "",
                        },
                        {
                            id: this.metadata.dataElements.dataElement.id,
                            value: issue.dataElement?.id || "",
                        },
                        {
                            id: this.metadata.dataElements.azureUrl.id,
                            value: issue.azureUrl,
                        },
                        {
                            id: this.metadata.dataElements.actionDescription.id,
                            value: issue.actionDescription,
                        },
                        {
                            id: this.metadata.dataElements.period.id,
                            value: issue.period,
                        },
                        {
                            id: this.metadata.dataElements.categoryOption.id,
                            value: issue.categoryOption?.id || "",
                        },
                        {
                            id: this.metadata.dataElements.followUp.id,
                            value: issue.followUp ? "true" : "false",
                        },
                        {
                            id: this.metadata.dataElements.contactEmails.id,
                            value: issue.contactEmails,
                        },
                        {
                            id: this.metadata.dataElements.comments.id,
                            value: issue.comments,
                        },
                        {
                            id: this.metadata.dataElements.sectionNumber.id,
                            value: String(programStageIndex + 1),
                        },
                    ],
                })
            );
        });
    }

    private buildIssues(
        events: D2TrackerEvent[],
        countries: Country[],
        dataElements: DataElement[],
        categoryOptions: CategoryOption[]
    ): QualityAnalysisIssue[] {
        return _(events)
            .map(d2Event => {
                const issueType = this.metadata.programs.qualityIssues.programStages.find(
                    programStage => programStage.id === d2Event.programStage
                );

                if (!issueType) {
                    console.warn(`Cannot find program stage: ${d2Event.programStage}`);
                    return undefined;
                }

                if (d2Event.dataValues.length === 0) return undefined;

                const dataValuesById = this.buildDataElementsById(d2Event.dataValues);

                const countryId = this.getDataValue(dataValuesById, "country");
                const country = countries.find(country => country.id === countryId);

                const issueAction = this.getValueFromOptionSet(
                    dataValuesById,
                    this.getDataElementIdOrThrow("action"),
                    "nhwaAction"
                );
                const issueStatus = this.getValueFromOptionSet(
                    dataValuesById,
                    this.getDataElementIdOrThrow("status"),
                    "nhwaStatus"
                );

                const categoryOptionId = this.getDataValue(dataValuesById, "categoryOption");
                const categoryOption = categoryOptions.find(
                    categoryOption => categoryOption.id === categoryOptionId
                );

                const dataElementId = this.getDataValue(dataValuesById, "dataElement");
                const dataElement = dataElements.find(
                    dataElement => dataElement.id === dataElementId
                );

                return new QualityAnalysisIssue({
                    action: issueAction,
                    actionDescription: this.getDataValue(dataValuesById, "actionDescription"),
                    azureUrl: this.getDataValue(dataValuesById, "azureUrl"),
                    categoryOption: categoryOption,
                    country: country,
                    dataElement: dataElement,
                    description: this.getDataValue(dataValuesById, "description"),
                    followUp: this.getDataValue(dataValuesById, "followUp") === "true",
                    id: d2Event.event,
                    number: this.getDataValue(dataValuesById, "issueNumber"),
                    period: this.getDataValue(dataValuesById, "period"),
                    status: issueStatus,
                    type: issueType.id,
                    comments: this.getDataValue(dataValuesById, "comments"),
                    contactEmails: this.getDataValue(dataValuesById, "contactEmails"),
                    correlative: this.getDataValue(dataValuesById, "correlative"),
                });
            })
            .compact()
            .value();
    }

    private getValueFromOptionSet(
        dataValuesById: HashMap<string, string>,
        dataElementId: Id,
        key: keyof MetadataItem["optionSets"]
    ): Maybe<IssueStatus | IssueAction> {
        const value = this.getValueOrDefault(dataValuesById.get(dataElementId));
        const option = this.metadata.optionSets[key].options.find(option => option.code === value);
        return option ? new IssueAction(option) : undefined;
    }

    private buildDataElementsById(dataValues: DataValue[]): HashMap<Id, string> {
        const attributesByPair = _(dataValues)
            .map(a => [a.dataElement, a.value] as [Id, string])
            .value();

        return HashMap.fromPairs(attributesByPair);
    }

    private getDataValue(
        dataValuesById: HashMap<Id, string>,
        dataElementName: DataElementKey
    ): string {
        return this.getValueOrDefault(
            dataValuesById.get(this.getDataElementIdOrThrow(dataElementName))
        );
    }

    private getValueOrDefault(value: Maybe<string>, defaultValue?: string): string {
        return value || defaultValue || "";
    }

    private getRelatedIdsFromDataValues(events: D2TrackerEvent[], dataElementId: Id): Id[] {
        const valuesFromEvents = _(events)
            .map(d2Event => {
                return _(d2Event.dataValues)
                    .map(dataValue => {
                        return dataValue.dataElement === dataElementId
                            ? dataValue.value
                            : undefined;
                    })
                    .compact()
                    .value();
            })
            .flatten()
            .value();
        return valuesFromEvents;
    }

    private getDataElementIdOrThrow(key: DataElementKey): string {
        const metadataItem = this.metadata.dataElements[key];
        if (!metadataItem) throw Error(`cannot found: ${key} indataElements`);
        return metadataItem.id;
    }

    private buildOrder(sorting: GetIssuesOptions["sorting"]): Maybe<string> {
        switch (sorting.field) {
            case "number":
                return `${this.getDataElementIdOrThrow("correlative")}:${sorting.order}`;
            case "status":
                return `${this.getDataElementIdOrThrow("status")}:${sorting.order}`;
            case "period":
                return `${this.getDataElementIdOrThrow("period")}:${sorting.order}`;
            case "description":
                return `${this.getDataElementIdOrThrow("description")}:${sorting.order}`;
            case "followUp":
                return `${this.getDataElementIdOrThrow("followUp")}:${sorting.order}`;
            case "action":
                return `${this.getDataElementIdOrThrow("action")}:${sorting.order}`;
            case "actionDescription":
                return `${this.getDataElementIdOrThrow("actionDescription")}:${sorting.order}`;
            case "azureUrl":
                return `${this.getDataElementIdOrThrow("azureUrl")}:${sorting.order}`;
        }
        return undefined;
    }

    private buildFilters(filter: GetIssuesOptions["filters"]): Maybe<string> {
        const numberFilter = filter.name
            ? `${this.metadata.dataElements.issueNumber.id}:LIKE:${filter.name}`
            : undefined;

        const periodsFilter = this.buildFilterMultipleValue(
            filter.periods,
            this.metadata.dataElements.period.id
        );

        const statusFilter = this.buildFilterMultipleValue(
            filter.status,
            this.metadata.dataElements.status.id
        );

        const actionsFilter = this.buildFilterMultipleValue(
            filter.actions,
            this.metadata.dataElements.action.id
        );

        const countriesFilter = this.buildFilterMultipleValue(
            filter.countries,
            this.metadata.dataElements.country.id
        );

        const followUpFilter = this.buildFollowUpFilter(filter.followUp);

        const stepFilter = this.buildFilterMultipleValue(
            filter.step,
            this.metadata.dataElements.sectionNumber.id
        );

        const allFilters = _([
            numberFilter,
            periodsFilter,
            statusFilter,
            actionsFilter,
            countriesFilter,
            followUpFilter,
            stepFilter,
        ])
            .compact()
            .value();

        return allFilters.length > 0 ? allFilters.join(",") : undefined;
    }

    private buildFilterMultipleValue(value: Maybe<string[]>, dataElementId: Id): Maybe<string> {
        const valueSeparatedByComma = value ? value.join(";") : undefined;
        return valueSeparatedByComma ? `${dataElementId}:IN:${valueSeparatedByComma}` : undefined;
    }

    private buildFollowUpFilter(followUpValue: Maybe<string>): Maybe<string> {
        if (followUpValue === "1") {
            return `${this.metadata.dataElements.followUp.id}:eq:true`;
        } else if (followUpValue === "0") {
            return `${this.metadata.dataElements.followUp.id}:eq:false`;
        } else {
            return undefined;
        }
    }
}

type DataElementKey = keyof MetadataItem["dataElements"];
