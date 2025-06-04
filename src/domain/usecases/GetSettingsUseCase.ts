import { FutureData } from "$/data/api-futures";
import { Settings } from "$/domain/entities/Settings";
import { SettingsRepository } from "$/domain/repositories/SettingsRepository";

export class GetSettingsUseCase {
    constructor(private settingsRepository: SettingsRepository) {}

    execute(): FutureData<Settings> {
        return this.settingsRepository.get();
    }
}
