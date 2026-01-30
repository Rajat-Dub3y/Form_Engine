import type { FieldSchemaAll } from "./types";

export function validateFieldSync(field: FieldSchemaAll, value: unknown): string | null {
  if (field.validation?.required && (value === undefined || value === null || value === "")) {
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

export async function validateFieldAsync(
  field: FieldSchemaAll,
  value: unknown,
  values?: Record<string, unknown>
): Promise<string | null> {
  // run sync rules first
  const sync = validateFieldSync(field, value);
  if (sync) return sync;

  // then optional async validator
  if (typeof field.asyncValidate === "function") {
    try {
      const res = await field.asyncValidate(value, values);
      return res;
    } catch {
      return "Validation failed";
    }
  }

  return null;
}