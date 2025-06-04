import { FutureData } from "$/data/api-futures";
import { DataElement } from "$/domain/entities/DataElement";
import { Id } from "$/domain/entities/Ref";

export interface DataElementRepository {
    getByIds(ids: Id[]): FutureData<DataElement[]>;
}
