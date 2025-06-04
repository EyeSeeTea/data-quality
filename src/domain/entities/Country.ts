import { NamedRef } from "./Ref";

export type Country = NamedRef & { path: string; writeAccess: boolean };
