import { describe, expect, it } from "vitest";
import { createAdminUser, createNonAdminUser, createUserWithGroups } from "./userFixtures";
import { UserGroup } from "$/domain/entities/UserGroup";

describe("User", () => {
    it("should be admin if has a role with authority ALL", () => {
        const user = createAdminUser();

        expect(user.isAdmin()).toBe(true);
    });
    it("should no be admin if hasn't a role with authority ALL", () => {
        const user = createNonAdminUser();

        expect(user.isAdmin()).toBe(false);
    });
    it("should return belong to user group equal to false when the id exist", () => {
        const userGroupId = "BwyMfDBLih9";

        const user = createUserWithGroups([
            UserGroup.build({ id: userGroupId, name: "Group 1", usersIds: [] }).get(),
        ]);

        expect(user.belongToUserGroup(userGroupId)).toBe(true);
    });
    it("should return belong to user group equal to false when the id does not exist", () => {
        const existedUserGroupId = "BwyMfDBLih9";
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups([
            UserGroup.build({ id: existedUserGroupId, name: "Group 1", usersIds: [] }).get(),
        ]);

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });
    it("should return belong to user group equal to false if user groups is empty", () => {
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups();

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });
});
