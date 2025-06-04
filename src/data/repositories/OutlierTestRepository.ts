import { Outlier } from "$/domain/entities/Outlier";
import { OutlierRepository } from "$/domain/repositories/OutlierRepository";
import { FutureData } from "$/data/api-futures";

export class OutlierTestRepository implements OutlierRepository {
    export(): FutureData<Outlier[]> {
        throw new Error("Method not implemented.");
    }
}
