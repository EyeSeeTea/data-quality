import { Maybe } from "$/utils/ts-utils";
import { NamedRef } from "@eyeseetea/d2-logger/domain/entities/Base";
import { convertToNumberOrZero } from "$/domain/usecases/common/utils";
import { DataElement } from "./DataElement";
import { DataValue } from "./DataValue";
import { Struct } from "./generic/Struct";
import { Id, Period } from "./Ref";

type MidwiferyNursingAttrs = {
    midwifery: MidwiferyNursingValue;
    personnel: MidwiferyNursingValue;
    isMidwiferyGreater: boolean;
    period: Period;
    countryId: Id;
    combination: NamedRef;
};

type MidwiferyNursingValue = {
    dataElement: DataElement;
    dataValue: Maybe<DataValue>;
};

export class MidwiferyNursing extends Struct<MidwiferyNursingAttrs>() {
    static build(data: MidwiferyNursingAttrs): MidwiferyNursing {
        return this.create({
            ...data,
            isMidwiferyGreater: this.checkIfMidwiferyIsGreater(data.midwifery, data.personnel),
        });
    }

    private static checkIfMidwiferyIsGreater(
        midwifery: MidwiferyNursingValue,
        nursing: MidwiferyNursingValue
    ): boolean {
        if (!midwifery.dataValue && !nursing.dataValue) return false;

        const midwiferyValue = convertToNumberOrZero(midwifery.dataValue?.value);
        const nursingValue = convertToNumberOrZero(nursing.dataValue?.value);

        return midwiferyValue > nursingValue;
    }
}
