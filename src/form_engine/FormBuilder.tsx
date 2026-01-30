import { useEffect, useState, useRef } from "react";
import type { FormSchema, FieldSchema } from "./types.ts";
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

  // 1. Hydration Guard: Prevents autosave from overwriting data before restoration is finished
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 2. Ref to track the current schema ID to handle schema changes correctly
  const lastSchemaId = useRef(schema.id);

  /* -------------------- Restore -------------------- */
  useEffect(() => {
    // Reset hydration if the schema ID changes
    if (lastSchemaId.current !== schema.id) {
      setIsHydrated(false);
      lastSchemaId.current = schema.id;
    }

    const raw = localStorage.getItem(schema.id);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          values: Record<string, unknown>;
          savedAt: number;
        };
        // Only update if there's actually data to prevent unnecessary cycles
        if (parsed.values) {
          setAllValues(parsed.values);
        }
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setIsHydrated(true);
  }, [schema.id, setAllValues]);

  /* -------------------- Autosave -------------------- */
  useEffect(() => {
    // Only save if we've successfully checked/restored local data
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      const payload = {
        values,
        savedAt: Date.now()
      };
      localStorage.setItem(schema.id, JSON.stringify(payload));
    }, 300); // Debounce saves by 300ms to improve Storybook performance

    return () => clearTimeout(timeoutId);
  }, [values, schema.id, isHydrated]);

  /* -------------------- Validation -------------------- */
  function handleBlur(field: FieldSchema) {
    const error = validateField(field, values[field.id]);
    setErrors(prev => ({
      ...prev,
      [field.id]: error ?? ""
    }));
  }

  /* -------------------- Render -------------------- */
  // Don't render inputs until we know which values to show
  if (!isHydrated) return <div className="p-4">Loading form data...</div>;

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      {schema.fields.map(field => {
        if (!isFieldVisible(field, values)) {
          return null;
        }

        /* -------- TEXT -------- */
        if (field.type === "text") {
          const value = typeof values[field.id] === "string" 
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
          const value = typeof values[field.id] === "boolean" 
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

        /* -------- SELECT (ASYNC) -------- */
        if (field.type === "select") {
          const value = typeof values[field.id] === "string" 
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