import { FutureData } from "$/data/api-futures";
import { DateISOString, Id } from "$/domain/entities/Ref";
import { ValidationRuleAnalysis } from "$/domain/entities/ValidationRuleAnalysis";

export interface ValidationRuleAnalysisRepository {
    get(options: ValidationRuleOptions): FutureData<ValidationRuleAnalysis[]>;
}

export type ValidationRuleOptions = {
    countryId: Id;
    startDate: DateISOString;
    endDate: DateISOString;
    validationRuleGroupId: Id;
};
