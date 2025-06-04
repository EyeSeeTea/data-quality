import { Id, Period } from "./Ref";

export interface DataValue {
    dataElementId: Id;
    period: Period;
    countryId: Id;
    categoryOptionComboId: Id;
    value: string;
}
