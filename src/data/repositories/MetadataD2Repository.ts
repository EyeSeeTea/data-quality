import _ from "lodash";

import { D2Api, MetadataPick } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { MetadataRepository } from "$/domain/repositories/MetadataRepository";
import { MetadataItem } from "$/domain/entities/MetadataItem";
import rec from "$/domain/entities/generic/Rec";
import { Future } from "$/domain/entities/generic/Future";

const metadataCodes = {
    organisationUnits: { global: "WHO-HQ" },
    optionSets: { nhwaAction: "NHWA_DQI_Action", nhwaStatus: "NHWA_DQI_Status" },
    programs: { qualityIssues: "NHWA_DQI_001" },
    trackedEntityTypes: { dataQuality: "NHWA_DQI - Data Quality Analysis" },
    trackedEntityAttributes: {
        endDate: "NHWA_DQI_TEA_End_Date",
        module: "NHWA_DQI_TEA_Dataset",
        name: "NHWA_DQI_TEA_Name",
        startDate: "NHWA_DQI_TEA_Start_Date",
        status: "NHWA_DQI_TEA_Status",
        lastModification: "NHWA_DQI_TEA_Last_Modification",
        countries: "NHWA_DQI_TEA_Countries_Analysis",
        sequential: "NHWA_DQI_TEA_Sequential",
    },
    dataElements: {
        issueNumber: "NHWA_DQI_Issue_Number",
        azureUrl: "NHWA_DQI_Azure_URL",
        period: "NHWA_DQI_Period",
        country: "NHWA_DQI_Country",
        dataElement: "NHWA_DQI_DataElement",
        categoryOption: "NHWA_DQI_Category_Option",
        description: "NHWA_DQI_Description",
        followUp: "NHWA_DQI_Follow-Up",
        status: "NHWA_DQI_Status",
        action: "NHWA_DQI_Action",
        actionDescription: "NHWA_DQI_Action_Description",
        contactEmails: "NHWA_DQI_Contact_Emails",
        comments: "NHWA_DQI_Comments",
        correlative: "NHWA_DQI_Issue_Correlative_Number",
        sectionNumber: "NHWA_DQI_Section_Number",
    },
    dataSets: { module1: "NHWA-M1-2023", module2: "NHWA-M2-2023" },
    userGroups: {
        dataCaptureModule1: "NHWA _DATA Capture Module 1",
        dataCaptureModule2And4: "NHWA _DATA Capture Module 2-4",
    },
};

const metadataFields = {
    trackedEntityTypes: {
        fields: { id: true, name: true, code: true },
        filter: { name: { in: rec(metadataCodes.trackedEntityTypes).values() } },
    },
    organisationUnits: {
        fields: { id: true, name: true, code: true },
        filter: { code: { in: rec(metadataCodes.organisationUnits).values() } },
    },
    dataSets: {
        fields: { id: true, name: true, code: true },
        filter: { code: { in: rec(metadataCodes.dataSets).values() } },
    },
    trackedEntityAttributes: {
        fields: { id: true, name: true, code: true },
        filter: { code: { in: rec(metadataCodes.trackedEntityAttributes).values() } },
    },
    optionSets: {
        fields: { id: true, name: true, code: true, options: { id: true, name: true, code: true } },
        filter: { code: { in: rec(metadataCodes.optionSets).values() } },
    },
    dataElements: {
        fields: { id: true, name: true, code: true },
        filter: { code: { in: rec(metadataCodes.dataElements).values() } },
    },
    programs: {
        fields: {
            id: true,
            name: true,
            code: true,
            programStages: { id: true, code: true, name: true, description: true, sortOrder: true },
        },
        filter: { code: { in: rec(metadataCodes.programs).values() } },
        order: "sortOrder:asc",
    },
    userGroups: {
        fields: { id: true, name: true, code: true, users: true },
        filter: { name: { in: rec(metadataCodes.userGroups).values() } },
    },
};

export class MetadataD2Repository implements MetadataRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<MetadataItem> {
        return this.getIndexedMetadata().flatMap(metadata => {
            return Future.success(metadata);
        });
    }

    private getIndexedMetadata(): FutureData<MetadataIndexed> {
        const d2Response = this.api.metadata.get(metadataFields);
        return apiToFuture(d2Response).flatMap(metadata => {
            const metadataIndexed = _.mapValues(metadata, (objs, key: keyof typeof metadata) => {
                const objsByCode = _.keyBy(objs, obj => obj.code);
                const objsByName = _.keyBy(objs, obj => obj.name);
                const dictionary = metadataCodes[key];
                return _.mapValues(dictionary, value => {
                    const obj = objsByCode[value] || objsByName[value];
                    if (!obj) throw Error(`Metadata object not found: ${key}.code/name="${value}"`);
                    return obj;
                });
            });
            return Future.success(metadataIndexed as unknown as MetadataIndexed);
        });
    }
}

type Codes = typeof metadataCodes;
type MetadataRequest = typeof metadataFields;
type MetadataResponse = MetadataPick<MetadataRequest>;
type MetadataIndexed = {
    [K in keyof Codes]: { [K2 in keyof Codes[K]]: MetadataResponse[K][number] };
};

export const MODULE_2_CODE = "NHWA-M2-2023";
