import React from "react";
import {
    GetRows,
    TableConfig,
    useLoading,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import { ObjectsTable } from "../data-table/ObjectsTable";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { IssueFilters } from "./IssueFilters";
import { initialFilters } from "$/webapp/utils/issues";
import { Maybe } from "$/utils/ts-utils";
import CloudDownload from "@material-ui/icons/CloudDownload";
import { useTableUtils } from "$/webapp/hooks/useTable";
import { useIssueColumns } from "./IssueColumns";

export function useCopyContactEmails(props: UseCopyContactEmailsProps) {
    const { onSuccess } = props;
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const copyContactEmails = React.useCallback(
        (
            issueId: Id,
            analysisId: Id,
            sectionId: Maybe<Id>,
            filters: GetIssuesOptions["filters"]
        ) => {
            loading.show(true, i18n.t("Copying Contact Emails and marking for Follow-Up"));
            compositionRoot.issues.copyEmails
                .execute({
                    analysisId: analysisId,
                    sectionId: sectionId,
                    issueId: issueId,
                    filters,
                })
                .run(
                    () => {
                        snackbar.success(i18n.t("Contact emails copied"));
                        loading.hide();
                        if (onSuccess) onSuccess();
                    },
                    error => {
                        snackbar.error(error.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.issues.copyEmails, loading, snackbar, onSuccess]
    );

    return copyContactEmails;
}

export function useExportIssues() {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const exportIssues = React.useCallback(
        (analysisId: Id, filters: GetIssuesOptions["filters"]) => {
            loading.show(true, i18n.t("Exporting Issues..."));
            compositionRoot.issues.export.execute({ analysisId: analysisId, filters }).run(
                () => {
                    snackbar.success(i18n.t("Issues exported"));
                    loading.hide();
                },
                error => {
                    snackbar.error(error.message);
                    loading.hide();
                }
            );
        },
        [compositionRoot.issues.export, loading, snackbar]
    );

    return exportIssues;
}

export function useTableConfig(props: UseTableConfigProps) {
    const { analysisId, filters, sectionId, showExport } = props;
    const { issueColumns, refresh, setRefresh } = useIssueColumns();

    const { saveColumns, columnsToShow } = useTableUtils<QualityAnalysisIssue>({
        storageId: "issues",
        columns: issueColumns,
    });

    const onSuccess = React.useCallback(() => {
        setRefresh(value => value + 1);
    }, [setRefresh]);

    const copyContactEmails = useCopyContactEmails({ onSuccess: onSuccess });
    const exportIssues = useExportIssues();

    const tableConfig = React.useMemo<TableConfig<QualityAnalysisIssue>>(() => {
        return {
            globalActions: showExport
                ? [
                      {
                          icon: <CloudDownload />,
                          name: "Export",
                          text: i18n.t("Export"),
                          onClick: () => {
                              exportIssues(analysisId, filters);
                          },
                      },
                  ]
                : undefined,
            actions: [
                {
                    name: "Extend Contact Emails",
                    text: i18n.t("Extend Follow-Up + Contact Emails"),
                    primary: false,
                    onClick(selectedIds) {
                        const issueId = selectedIds[0];
                        if (!issueId) return false;
                        copyContactEmails(issueId, analysisId, sectionId, filters);
                    },
                },
            ],
            columns: columnsToShow,
            initialSorting: { field: "number", order: "asc" },
            paginationOptions: {
                pageSizeOptions: [10, 20, 50],
                pageSizeInitialValue: 20,
                renderPosition: { bottom: true, top: false },
            },
            searchBoxLabel: i18n.t("Issue Number"),
            onReorderColumns: saveColumns,
        };
    }, [
        columnsToShow,
        filters,
        analysisId,
        sectionId,
        copyContactEmails,
        exportIssues,
        showExport,
        saveColumns,
    ]);

    return { tableConfig, refresh };
}

export function useGetRows(
    filters: GetIssuesOptions["filters"],
    reloadKey: number,
    analysisId: Id,
    sectionId: Maybe<Id>,
    refreshIssue: number
) {
    const { compositionRoot } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const getRows = React.useCallback<GetRows<QualityAnalysisIssue>>(
        (search, pagination, sorting) => {
            return new Promise((resolve, reject) => {
                if (reloadKey < 0 || refreshIssue < 0)
                    return resolve({
                        pager: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
                        objects: [],
                    });

                setLoading(true);
                return compositionRoot.summary.get
                    .execute({
                        pagination: { page: pagination.page, pageSize: pagination.pageSize },
                        sorting: { field: sorting.field, order: sorting.order },
                        filters: {
                            actions: filters.actions,
                            countries: filters.countries,
                            name: search,
                            periods: filters.periods,
                            status: filters.status,
                            analysisIds: [analysisId],
                            sectionId: sectionId,
                            id: undefined,
                            followUp: filters.followUp,
                            step: filters.step,
                        },
                    })
                    .run(
                        response => {
                            setLoading(false);
                            resolve({ pager: response.pagination, objects: response.rows });
                        },
                        err => {
                            setLoading(false);
                            reject(new Error(err.message));
                        }
                    );
            });
        },
        [
            reloadKey,
            refreshIssue,
            compositionRoot.summary.get,
            filters.actions,
            filters.countries,
            filters.periods,
            filters.status,
            filters.followUp,
            filters.step,
            analysisId,
            sectionId,
        ]
    );

    return { getRows, loading };
}

export const IssueTable: React.FC<IssueTableProps> = React.memo(props => {
    const { analysisId, reload, sectionId, showExport, showStepFilter } = props;
    const [filters, setFilters] = React.useState(initialFilters);

    const { tableConfig, refresh } = useTableConfig({
        filters,
        analysisId: analysisId,
        sectionId: sectionId,
        showExport: showExport,
        showStepFilter: showStepFilter,
    });
    const { getRows, loading } = useGetRows(filters, reload, analysisId, sectionId, refresh);
    const config = useObjectsTable(tableConfig, getRows);

    const filterComponents = React.useMemo(() => {
        return (
            <IssueFilters
                initialFilters={filters}
                showStepFilter={showStepFilter}
                onChange={setFilters}
            />
        );
    }, [filters, showStepFilter]);

    return <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />;
});

type IssueTableProps = {
    analysisId: Id;
    reload: number;
    sectionId: Maybe<Id>;
    showExport?: boolean;
    showStepFilter?: boolean;
};

type UseTableConfigProps = {
    analysisId: Id;
    filters: GetIssuesOptions["filters"];
    sectionId: Maybe<Id>;
    showExport?: boolean;
    showStepFilter?: boolean;
};

type UseCopyContactEmailsProps = { onSuccess?: () => void };
