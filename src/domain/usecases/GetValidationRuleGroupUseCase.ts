import { FutureData } from "$/data/api-futures";
import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";
import { ValidationRuleGroupRepository } from "$/domain/repositories/ValidationRuleGroupRepository";

export class GetValidationRuleGroupUseCase {
    constructor(private validationRuleGroupRepository: ValidationRuleGroupRepository) {}

    execute(): FutureData<ValidationRuleGroup[]> {
        return this.validationRuleGroupRepository.get();
    }
}
