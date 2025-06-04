import { Id, Period } from "./Ref";
import { ValidationRule } from "./ValidationRuleGroup";

export type ValidationRuleAnalysis = {
    id: Id;
    countryId: Id;
    period: Period;
    categoryOptionId: Id;
    leftValue: number;
    rightValue: number;
    operator: string;
    validationRule: ValidationRule;
};
