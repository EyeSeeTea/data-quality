import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";

export interface ValidationRuleGroupRepository {
    get(): FutureData<ValidationRuleGroup[]>;
    getById(id: Id): FutureData<ValidationRuleGroup>;
}
