import { Settings } from "$/domain/entities/Settings";
import { SettingsRepository } from "$/domain/repositories/SettingsRepository";
import { FutureData } from "$/data/api-futures";

export class SettingsTestRepository implements SettingsRepository {
    get(): FutureData<Settings> {
        throw new Error("Method not implemented.");
    }
}
