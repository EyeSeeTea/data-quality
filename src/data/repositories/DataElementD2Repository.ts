import { D2Api } from "$/types/d2-api";

import { DataElement } from "$/domain/entities/DataElement";
import { DataElementRepository } from "$/domain/repositories/DataElementRepository";
import { FutureData } from "$/data/api-futures";
import { D2DataElement } from "$/data/common/D2DataElement";

export class DataElementD2Repository implements DataElementRepository {
    d2DataElement: D2DataElement;

    constructor(private api: D2Api) {
        this.d2DataElement = new D2DataElement(this.api);
    }

    getByIds(ids: string[]): FutureData<DataElement[]> {
        return this.d2DataElement.getByIds(ids);
    }
}
