import { D2Api } from "$/types/d2-api";
import { DataValue } from "$/domain/entities/DataValue";
import {
    DataValueRepository,
    GetDataValueOptions,
} from "$/domain/repositories/DataValueRepository";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";

export class DataValueD2Repository implements DataValueRepository {
    constructor(private api: D2Api) {}

    get(options: GetDataValueOptions): FutureData<DataValue[]> {
        return apiToFuture(
            this.api.dataValues.getSet({
                dataSet: options.moduleIds || [],
                orgUnit: options.countriesIds || [],
                startDate: options.startDate || undefined,
                endDate: options.endDate || undefined,
                period: options.period || undefined,
                children: true,
            })
        ).map(d2Response => {
            return d2Response.dataValues.map(this.buildDataValue);
        });
    }

    private buildDataValue(d2DataValue: DataValueSetsDataValue): DataValue {
        return {
            categoryOptionComboId: d2DataValue.categoryOptionCombo,
            countryId: d2DataValue.orgUnit,
            dataElementId: d2DataValue.dataElement,
            period: d2DataValue.period,
            value: d2DataValue.value,
        };
    }
}
