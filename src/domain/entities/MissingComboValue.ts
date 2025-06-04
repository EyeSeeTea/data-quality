import { Id, NamedRef, Period } from "./Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";
import { DataValue } from "./DataValue";

export type MissingComboValuesAttrs = {
    countryId: Id;
    period: Period;
    disaggregation: NamedRef;
    combination: NamedRef;
    dataElements: MissingCombination[];
    dataElementsToInclude: string[];
    hasMissingValues: boolean;
};

type MissingCombination = NamedRef & { dataValue: Maybe<DataValue> };

export class MissingComboValue extends Struct<MissingComboValuesAttrs>() {
    static build(data: MissingComboValuesAttrs): MissingComboValue {
        return MissingComboValue.create({
            ...data,
            hasMissingValues: this.checkIfMissing(data.dataElements, data.dataElementsToInclude),
        });
    }

    static getMissingCombinations(data: MissingComboValuesAttrs): MissingCombination[] {
        const onlyIncluded = MissingComboValue.filterByIncluded(
            data.dataElementsToInclude,
            data.dataElements
        );
        return onlyIncluded.filter(dataElement => dataElement.dataValue === undefined);
    }

    private static checkIfMissing(
        dataElements: MissingCombination[],
        dataElementsToInclude: string[]
    ): boolean {
        const onlyIncluded = MissingComboValue.filterByIncluded(
            dataElementsToInclude,
            dataElements
        );

        if (onlyIncluded.length === 0) return false;

        if (onlyIncluded.every(dataElement => dataElement.dataValue === undefined)) return false;

        return onlyIncluded.some(dataElement => dataElement.dataValue === undefined);
    }

    private static filterByIncluded(
        dataElementsToInclude: string[],
        dataElements: MissingCombination[]
    ) {
        return dataElementsToInclude.length > 0
            ? dataElements.filter(dataElement => {
                  return dataElementsToInclude.includes(dataElement.name);
              })
            : dataElements;
    }
}
