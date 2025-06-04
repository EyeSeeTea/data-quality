import { Maybe } from "$/utils/ts-utils";
import { Country } from "./Country";
import { Struct } from "./generic/Struct";
import { DateISOString, NamedRef } from "./Ref";
import { UserGroup } from "./UserGroup";

export interface UserAttrs {
    id: string;
    email: string;
    name: string;
    username: string;
    lastLogin: Maybe<DateISOString>;
    userRoles: UserRole[];
    userGroups: UserGroup[];
    countries: Country[];
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class User extends Struct<UserAttrs>() {
    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    }
}
