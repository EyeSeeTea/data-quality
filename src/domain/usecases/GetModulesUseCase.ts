import { FutureData } from "$/data/api-futures";
import { Module } from "$/domain/entities/Module";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";

export class GetModulesUseCase {
    constructor(private moduleRepository: ModuleRepository) {}

    execute(): FutureData<Module[]> {
        return this.moduleRepository.get();
    }
}
