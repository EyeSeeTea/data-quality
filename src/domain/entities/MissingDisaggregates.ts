import { Id, NamedRef, Period } from "./Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";
import { DataValue } from "./DataValue";

export type MissingDisaggregatesAttrs = {
    countryId: Id;
    period: Period;
    disaggregation: NamedRef;
    dataElement: NamedRef;
    combinations: MissingCombination[];
    combinationsToInclude: string[];
    hasMissingValues: boolean;
};

type MissingCombination = NamedRef & { dataValue: Maybe<DataValue> };

export class MissingDisaggregates extends Struct<MissingDisaggregatesAttrs>() {
    static build(data: MissingDisaggregatesAttrs): MissingDisaggregates {
        return MissingDisaggregates.create({
            ...data,
            hasMissingValues: this.checkIfMissing(data.combinations, data.combinationsToInclude),
        });
    }

    static getMissingCombinations(data: MissingDisaggregatesAttrs): MissingCombination[] {
        const onlyIncluded = MissingDisaggregates.filterByIncluded(
            data.combinationsToInclude,
            data.combinations
        );
        return onlyIncluded.filter(combination => combination.dataValue === undefined);
    }

    private static checkIfMissing(
        combinations: MissingCombination[],
        combinationsToInclude: string[]
    ): boolean {
        const onlyIncluded = MissingDisaggregates.filterByIncluded(
            combinationsToInclude,
            combinations
        );

        if (onlyIncluded.length === 0) return false;

        if (onlyIncluded.every(combination => combination.dataValue === undefined)) return false;

        return onlyIncluded.some(combination => combination.dataValue === undefined);
    }

    private static filterByIncluded(
        combinationsToInclude: string[],
        combinations: MissingCombination[]
    ) {
        return combinationsToInclude.length > 0
            ? combinations.filter(combination => {
                  return combinationsToInclude.includes(combination.name);
              })
            : combinations;
    }
}

export type MissingDisaggregatesComboAttrs = {
    countryId: Id;
    period: Period;
    disaggregation: NamedRef;
    combination: NamedRef;
    dataElements: MissingCombination[];
    dataElementsToInclude: string[];
    hasMissingValues: boolean;
};
