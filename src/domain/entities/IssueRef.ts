import { Struct } from "./generic/Struct";
import { Id } from "./Ref";

type IssueRefCode = string;
type IssueRefAttrs = { id: Id; name: string; code: IssueRefCode };

export abstract class IssueRef extends Struct<IssueRefAttrs>() {}
