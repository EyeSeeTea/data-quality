export type Id = string;

export interface Ref {
    id: Id;
}

export interface NamedRef extends Ref {
    name: string;
}

export interface NamedCodeRef extends NamedRef {
    code: string;
}

export type IssuePeriod = string;
export type IssueNumber = string;
export type Period = string;
export type DateISOString = string;
