import { FutureData } from "$/data/api-futures";
import { Settings } from "$/domain/entities/Settings";

export interface SettingsRepository {
    get(): FutureData<Settings>;
}
