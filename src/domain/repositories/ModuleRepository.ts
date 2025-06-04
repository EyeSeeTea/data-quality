import { FutureData } from "$/data/api-futures";
import { Module } from "$/domain/entities/Module";
import { Id } from "$/domain/entities/Ref";

export interface ModuleRepository {
    get(): FutureData<Module[]>;
    getByIds(ids: Id[]): FutureData<Module[]>;
}
