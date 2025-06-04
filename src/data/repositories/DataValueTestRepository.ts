import { DataValue } from "$/domain/entities/DataValue";
import { DataValueRepository } from "$/domain/repositories/DataValueRepository";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";

export class DataValueTestRepository implements DataValueRepository {
    get(): FutureData<DataValue[]> {
        return Future.success([]);
    }
}
