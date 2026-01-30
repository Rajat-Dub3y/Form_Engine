import { useEffect, useRef } from "react";
import type { FormSchema, FieldSchema } from "./types";
import { useFormState } from "../hooks/useFormState";
import { validateField } from "./validator";
import { isFieldVisible } from "./conditionResolver";

import { CheckboxField } from "./fields/CheckboxField";
import { SelectField } from "./fields/SelectField";
import TextField from "./fields/TextField";

type Props = {
  schema: FormSchema;
};

export function FormBuilder({ schema }: Props) {
  const {
    values,
    errors,
    setValue,
    setErrors,
    setAllValues
  } = useFormState();

  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;

    const raw = localStorage.getItem(schema.id);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          values: Record<string, unknown>;
          savedAt: number;
        };

        if (parsed.values) {
          setAllValues(parsed.values);
        }
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }

    restoredRef.current = true;
  }, [schema.id, setAllValues]);

  /* -------------------- Autosave -------------------- */
  useEffect(() => {
    if (!restoredRef.current) return;

    const timeoutId = setTimeout(() => {
      const payload = {
        values,
        savedAt: Date.now()
      };
      localStorage.setItem(schema.id, JSON.stringify(payload));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [values, schema.id]);

  /* -------------------- Validation -------------------- */
  function handleBlur(field: FieldSchema) {
    const error = validateField(field, values[field.id]);
    setErrors(prev => ({
      ...prev,
      [field.id]: error ?? ""
    }));
  }

  /* -------------------- Render -------------------- */
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      {schema.fields.map(field => {
        if (!isFieldVisible(field, values)) {
          return null;
        }

        /* -------- TEXT -------- */
        if (field.type === "text") {
          const value =
            typeof values[field.id] === "string"
              ? (values[field.id] as string)
              : "";

          return (
            <TextField
              key={field.id}
              id={field.id}
              label={field.label}
              value={value}
              error={errors[field.id]}
              onChange={v => setValue(field.id, v)}
              onBlur={() => handleBlur(field)}
            />
          );
        }

        /* -------- CHECKBOX -------- */
        if (field.type === "checkbox") {
          const value =
            typeof values[field.id] === "boolean"
              ? (values[field.id] as boolean)
              : false;

          return (
            <CheckboxField
              key={field.id}
              id={field.id}
              label={field.label}
              value={value}
              error={errors[field.id]}
              onChange={v => setValue(field.id, v)}
            />
          );
        }

        /* -------- SELECT -------- */
        if (field.type === "select") {
          const value =
            typeof values[field.id] === "string"
              ? (values[field.id] as string)
              : "";

          return (
            <SelectField
              key={field.id}
              id={field.id}
              label={field.label}
              value={value}
              error={errors[field.id]}
              loadOptions={field.loadOptions}
              onChange={v => setValue(field.id, v)}
            />
          );
        }

        return null;
      })}
    </form>
  );
}
