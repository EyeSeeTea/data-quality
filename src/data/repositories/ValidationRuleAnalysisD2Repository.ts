import { ValidationRuleAnalysis } from "$/domain/entities/ValidationRuleAnalysis";
import { D2Api } from "$/types/d2-api";
import { Id } from "$/domain/entities/Ref";
import { FutureData, apiToFuture } from "$/data/api-futures";
import {
    ValidationRuleAnalysisRepository,
    ValidationRuleOptions,
} from "$/domain/repositories/ValidationRuleAnalysisRepository";
import { ValidationRule } from "$/domain/entities/ValidationRuleGroup";
import _ from "$/domain/entities/generic/Collection";
import { Future } from "$/domain/entities/generic/Future";
import i18n from "$/utils/i18n";

export class ValidationRuleAnalysisD2Repository implements ValidationRuleAnalysisRepository {
    constructor(private api: D2Api) {}

    get(options: ValidationRuleOptions): FutureData<ValidationRuleAnalysis[]> {
        if (!options.countryId)
            return Future.error(new Error(i18n.t("Select at least one organisation unit")));
        return apiToFuture(
            this.api.request<D2ValidationRuleAnalysis[]>({
                method: "post",
                url: "/dataAnalysis/validationRules",
                data: {
                    notification: false,
                    persist: false,
                    ou: options.countryId,
                    startDate: options.startDate,
                    endDate: options.endDate,
                    vrg: options.validationRuleGroupId,
                },
            })
        ).flatMap(response => {
            const validationsRulesIds = response.map(element => element.validationRuleId);
            return this.getValidationsRules(validationsRulesIds).flatMap(validationsRules => {
                const validationRulesAnalysis = response.map(element => {
                    const validationRule = validationsRules.find(
                        validationRule => validationRule.id === element.validationRuleId
                    );
                    if (!validationRule) {
                        throw new Error(`Validation rule ${element.validationRuleId} not found`);
                    }

                    const rule: ValidationRuleAnalysis = {
                        validationRule: validationRule,
                        id: element.validationRuleId,
                        countryId: element.organisationUnitId,
                        period: element.periodId,
                        categoryOptionId: element.attributeOptionComboId,
                        leftValue: element.leftSideValue,
                        operator: element.operator,
                        rightValue: element.rightSideValue,
                    };
                    return rule;
                });
                return Future.success(validationRulesAnalysis);
            });
        });
    }

    getValidationsRules(ids: Id[]): FutureData<ValidationRule[]> {
        const $requests = Future.sequential(
            _(ids)
                .chunk(50)
                .map(validationRuleIds => {
                    return apiToFuture(
                        this.api.models.validationRules.get({
                            fields: { id: true, displayName: true, displayDescription: true },
                            filter: { id: { in: validationRuleIds } },
                            paging: false,
                        })
                    ).map(d2Response => {
                        return d2Response.objects.map((d2ValidationRule): ValidationRule => {
                            return {
                                id: d2ValidationRule.id,
                                name: d2ValidationRule.displayName,
                                description: d2ValidationRule.displayDescription,
                            };
                        });
                    });
                })
                .value()
        );

        return Future.sequential([$requests]).flatMap(results => {
            const allValidationsRules = _(results[0] || [])
                .flatten()
                .value();
            return Future.success(allValidationsRules);
        });
    }
}

type D2ValidationRuleAnalysis = {
    validationRuleId: Id;
    organisationUnitId: Id;
    periodId: Id;
    attributeOptionComboId: Id;
    leftSideValue: number;
    operator: string;
    rightSideValue: number;
};
