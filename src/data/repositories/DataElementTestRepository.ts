import { DataElement } from "$/domain/entities/DataElement";
import { Future } from "$/domain/entities/generic/Future";
import { DataElementRepository } from "$/domain/repositories/DataElementRepository";
import { FutureData } from "$/data/api-futures";

export class DataElementTestRepository implements DataElementRepository {
    getByIds(): FutureData<DataElement[]> {
        return Future.success([]);
    }
}
