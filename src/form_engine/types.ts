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

export type FieldSchema =
  | TextFieldSchema
  | CheckboxFieldSchema
  | SelectFieldSchema;

export type FormSchema = {
  id: string;
  fields: FieldSchema[];
};