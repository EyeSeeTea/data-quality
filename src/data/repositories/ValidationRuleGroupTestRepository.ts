import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";
import { ValidationRuleGroupRepository } from "$/domain/repositories/ValidationRuleGroupRepository";
import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "$/data/api-futures";

export class ValidationRuleTestRepository implements ValidationRuleGroupRepository {
    getById(): FutureData<ValidationRuleGroup> {
        throw new Error("Method not implemented.");
    }
    get(): FutureData<ValidationRuleGroup[]> {
        return Future.success([]);
    }
}
