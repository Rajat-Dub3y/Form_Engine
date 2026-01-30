import type{ FieldSchema } from "./types";

export function isFieldVisible(
  field: FieldSchema,
  values: Record<string, unknown>
): boolean {
  if (!field.visibleIf) return true;

  const targetValue = values[field.visibleIf.fieldId];
  const conditionValue = field.visibleIf.value;

  switch (field.visibleIf.operator) {
    case "equals":
      return targetValue === conditionValue;

    case "greaterThan":
      if (
        typeof targetValue === "number" &&
        typeof conditionValue === "number"
      ) {
        return targetValue > conditionValue;
      }
      return false;

    default:
      return true;
  }
}