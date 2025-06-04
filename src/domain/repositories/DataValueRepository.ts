import { FutureData } from "$/data/api-futures";
import { DataValue } from "$/domain/entities/DataValue";
import { DateISOString, Id, Period } from "$/domain/entities/Ref";

export interface DataValueRepository {
    get(options: GetDataValueOptions): FutureData<DataValue[]>;
}

export type GetDataValueOptions = {
    moduleIds?: Id[];
    countriesIds?: Id[];
    period?: Period[];
    startDate?: DateISOString;
    endDate?: DateISOString;
};
