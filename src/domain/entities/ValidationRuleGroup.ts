import { Maybe } from "$/utils/ts-utils";
import { NamedRef } from "@eyeseetea/d2-logger/domain/entities/Base";
import { Id } from "./Ref";

export type ValidationRuleGroup = {
    id: Id;
    name: string;
    description: Maybe<string>;
};

export type ValidationRule = NamedRef & { description: Maybe<string> };
