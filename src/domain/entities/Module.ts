import { DataElement } from "./DataElement";
import { NamedCodeRef, NamedRef } from "./Ref";

export type Module = NamedCodeRef & {
    dataElements: DataElement[];
    disaggregations: NamedRef[];
};
