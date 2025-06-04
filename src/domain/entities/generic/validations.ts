import { ValidationErrorKey } from "./Errors";

export function validateRequired(
    value: any,
    errorCode: ValidationErrorKey = "field_cannot_be_blank"
): ValidationErrorKey[] {
    const isBlank = !value || (value.length !== undefined && value.length === 0);

    return isBlank ? setErrorCode(errorCode) : [];
}

function setErrorCode(errorCode?: ValidationErrorKey): ValidationErrorKey[] {
    return errorCode ? [errorCode] : ["field_cannot_be_blank"];
}
