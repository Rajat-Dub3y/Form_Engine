import type { FieldSchema } from "./types";
export function validateField(
  field: FieldSchema,
  value: unknown
): string | null {
  if (field.validation?.required && !value) {
    return "This field is required";
  }

  if (
    field.type === "text" &&
    field.validation?.minLength &&
    typeof value === "string" &&
    value.length < field.validation.minLength
  ) {
    return `Minimum length is ${field.validation.minLength}`;
  }

  return null;
}