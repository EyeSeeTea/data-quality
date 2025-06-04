import { Maybe } from "$/utils/ts-utils";
import { NamedCodeRef, NamedRef } from "./Ref";

export type DataElement = NamedCodeRef & {
    originalName: string;
    isNumber: boolean;
    disaggregation: Maybe<NamedRef & { options: NamedRef[] }>;
};
