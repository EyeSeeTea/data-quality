import { Module } from "$/domain/entities/Module";
import { Future } from "$/domain/entities/generic/Future";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { FutureData } from "$/data/api-futures";

export class ModuleTestRepository implements ModuleRepository {
    getByIds(): FutureData<Module[]> {
        return Future.success([]);
    }
    get(): FutureData<Module[]> {
        return Future.success([]);
    }
}
