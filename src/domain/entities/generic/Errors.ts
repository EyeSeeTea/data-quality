import i18n from "$/utils/i18n";

export type ValidationErrorKey = "field_cannot_be_blank";

export const validationErrorMessages: Record<ValidationErrorKey, (fieldName: string) => string> = {
    field_cannot_be_blank: (fieldName: string) =>
        i18n.t(`Cannot be blank: {{fieldName}}`, { fieldName: fieldName, nsSeparator: false }),
};

export function getErrors<T>(errors: ValidationError<T>[]) {
    return errors
        .map(error => {
            return error.errors.map(err => validationErrorMessages[err](error.property as string));
        })
        .flat()
        .join("\n");
}

export type ValidationError<T> = {
    property: keyof T;
    value: unknown;
    errors: ValidationErrorKey[];
};
