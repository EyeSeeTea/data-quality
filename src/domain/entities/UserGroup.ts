import { Id } from "./Ref";
import { Either } from "./generic/Either";
import { ValidationError } from "./generic/Errors";
import { Struct } from "./generic/Struct";
import { validateRequired } from "./generic/validations";

type UserGroupAttrs = {
    id: Id;
    name: string;
    usersIds: Id[];
};

export class UserGroup extends Struct<UserGroupAttrs>() {
    static build(attrs: UserGroupAttrs): Either<ValidationError<UserGroup>[], UserGroup> {
        const userGroup = new UserGroup(attrs);

        const errors: ValidationError<UserGroup>[] = [
            {
                property: "name" as const,
                errors: validateRequired(userGroup.name),
                value: userGroup.name,
            },
            {
                property: "id" as const,
                errors: validateRequired(userGroup.id),
                value: userGroup.id,
            },
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.success(userGroup);
        } else {
            return Either.error(errors);
        }
    }
}
