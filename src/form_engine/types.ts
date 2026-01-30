export type Operator = "equals" | "greaterThan";

export type VisibleIf = {
  fieldId: string;
  operator: Operator;
  value: unknown;
};

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
};

export type BaseField = {
  id: string;
  label: string;
  visibleIf?: VisibleIf;
  validation?: ValidationRule;
  // optional async validator: returns error message or null
  asyncValidate?: (value: unknown, values?: Record<string, unknown>) => Promise<string | null>;
};

export type TextFieldSchema = BaseField & {
  type: "text";
};

export type CheckboxFieldSchema = BaseField & {
  type: "checkbox";
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectFieldSchema = BaseField & {
  type: "select";
  loadOptions: () => Promise<SelectOption[]>;
};

export type GroupFieldSchema = BaseField & {
  type: "group";
  fields: FieldSchemaAll[]; // nested fields
};

export type RepeaterFieldSchema = BaseField & {
  type: "repeater";
  fields: FieldSchemaAll[]; // item fields
  minItems?: number;
  maxItems?: number;
};

export type FieldSchema =
  | TextFieldSchema
  | CheckboxFieldSchema
  | SelectFieldSchema;

// Extend union with nested/group and repeater types
export type FieldSchemaExtended =
  | FieldSchema
  | GroupFieldSchema
  | RepeaterFieldSchema;

// For backward-compat, export FieldSchema as FieldSchemaExtended
export type FieldSchemaAll = FieldSchemaExtended;

export type FormSchema = {
  id: string;
  fields: FieldSchemaAll[];
};