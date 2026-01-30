import type { FieldSchemaAll } from "./types";
import { getIn } from "./utils.ts";

export function isFieldVisible(
  field: FieldSchemaAll,
  values: Record<string, unknown>
): boolean {
  if (!field.visibleIf) return true;

  const targetValue = getIn(values, field.visibleIf.fieldId);
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