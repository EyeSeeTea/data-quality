import _ from "lodash";

import { FutureData } from "$/data/api-futures";
import { DataValue } from "$/domain/entities/DataValue";
import { Id, Period } from "$/domain/entities/Ref";
import { DataValueRepository } from "$/domain/repositories/DataValueRepository";
import { Future } from "$/domain/entities/generic/Future";
import i18n from "$/utils/i18n";

export class UCDataValue {
    constructor(private dataValueRepository: DataValueRepository) {}

    get(countriesIds: Id[], moduleIds: Id[], periods: Period[]): FutureData<DataValue[]> {
        if (countriesIds.length === 0)
            throw new Error(i18n.t("Select at least one organisation unit"));

        const [startDate, endDate] = periods;
        if (!startDate || !endDate) throw new Error("Invalid period");
        const periodsToSearch = _.range(Number(startDate), Number(endDate) + 1);
        const $requests = _(countriesIds)
            .chunk(1)
            .map(countryIds => {
                return this.dataValueRepository.get({
                    moduleIds: moduleIds,
                    countriesIds: countryIds,
                    period: periodsToSearch.map(period => String(period)),
                });
            })
            .value();

        return Future.sequential($requests).flatMap(result => {
            return Future.success(_(result).flatten().value());
        });
    }

    getByCountryAndPeriod(dataValues: DataValue[]): Record<string, DataValue[]> {
        return _(dataValues)
            .groupBy(dataValue => {
                return `${dataValue.countryId}.${dataValue.period}`;
            })
            .value();
    }
}
