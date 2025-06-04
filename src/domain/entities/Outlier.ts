import { Id, Period } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";

export type Outlier = {
    dataElementId: Id;
    countryId: Id;
    categoryOptionId: Id;
    period: Period;
    zScore: Maybe<number>;
};
