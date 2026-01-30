import { useEffect, useRef, useState } from "react";
import type { FormSchema, FieldSchemaAll } from "./types";
import { useFormState } from "../hooks/useFormState";
import { isFieldVisible } from "./conditionResolver";

import { CheckboxField } from "./fields/CheckboxField";
import { SelectField } from "./fields/SelectField";
import TextField from "./fields/TextField";
import { getIn } from "./utils.ts";
import { validateFieldAsync } from "./validator";

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
  const [validating, setValidating] = useState<Record<string, boolean>>({});

  const restoredRef = useRef(false);
  const lastSavedAtRef = useRef<number>(0);
  const [conflict, setConflict] = useState<{
    remoteValues: Record<string, unknown>;
    remoteSavedAt: number;
  } | null>(null);

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
          lastSavedAtRef.current = parsed.savedAt ?? 0;
        }
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }

    restoredRef.current = true;
  }, [schema.id, setAllValues]);

  /* -------------------- Storage conflict handling -------------------- */
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== schema.id) return;
      if (!e.newValue) return;

      try {
        const parsed = JSON.parse(e.newValue) as {
          values: Record<string, unknown>;
          savedAt: number;
        };

        if ((parsed.savedAt ?? 0) > lastSavedAtRef.current) {
          // remote is newer
          const same = JSON.stringify(parsed.values) === JSON.stringify(values);
          if (!same) {
            setConflict({ remoteValues: parsed.values, remoteSavedAt: parsed.savedAt ?? Date.now() });
          } else {
            lastSavedAtRef.current = parsed.savedAt ?? lastSavedAtRef.current;
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [schema.id, values]);

  /* -------------------- Autosave -------------------- */
  useEffect(() => {
    if (!restoredRef.current) return;

    const timeoutId = setTimeout(() => {
      const payload = {
        values,
        savedAt: Date.now()
      };
      localStorage.setItem(schema.id, JSON.stringify(payload));
      lastSavedAtRef.current = payload.savedAt;
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [values, schema.id]);

  /* -------------------- Validation -------------------- */
  // top-level blur removed (use handleBlurAt for all fields)

  function handleBlurAt(field: FieldSchemaAll, path: string) {
    // skip validation for hidden fields
    if (!isFieldVisible(field, values)) {
      setErrors(prev => ({ ...prev, [path]: "" }));
      return;
    }

    const val = getIn(values, path);
    // async validation support
    (async () => {
      setValidating(prev => ({ ...prev, [path]: true }));
      const err = await validateFieldAsync(field, val, values);
      setErrors(prev => ({ ...prev, [path]: err ?? "" }));
      setValidating(prev => ({ ...prev, [path]: false }));
    })();
  }

  /* -------------------- Render -------------------- */
  return (
    <>
      {conflict ? (
        <div>
          <div>Conflict detected: remote changes found.</div>
          <button
            type="button"
            onClick={() => {
              // accept remote
              setAllValues(conflict.remoteValues);
              setErrors({});
              lastSavedAtRef.current = conflict.remoteSavedAt;
              setConflict(null);
            }}
          >
            Accept Remote
          </button>
          <button
            type="button"
            onClick={() => {
              // keep local: overwrite remote
              const payload = { values, savedAt: Date.now() };
              localStorage.setItem(schema.id, JSON.stringify(payload));
              lastSavedAtRef.current = payload.savedAt;
              setConflict(null);
            }}
          >
            Keep Local
          </button>
        </div>
      ) : null}

      <form onSubmit={(e) => e.preventDefault()}>
        {schema.fields.map(field => renderField(field))}
      </form>
    </>
  );

  function renderField(field: FieldSchemaAll, parentPath?: string) {
    const fullId = parentPath ? `${parentPath}.${field.id}` : field.id;

    if (!isFieldVisible(field, values)) return null;

    // primitive fields
    if (field.type === "text") {
      const value = typeof getIn(values, fullId) === "string" ? (getIn(values, fullId) as string) : "";

      return (
        <TextField
          key={fullId}
          id={fullId}
          label={field.label}
          value={value}
          error={errors[fullId]}
          validating={!!validating[fullId]}
          onChange={v => setValue(fullId, v)}
          onBlur={() => handleBlurAt(field, fullId)}
        />
      );
    }

    if (field.type === "checkbox") {
      const value = typeof getIn(values, fullId) === "boolean" ? (getIn(values, fullId) as boolean) : false;

      return (
        <CheckboxField
          key={fullId}
          id={fullId}
          label={field.label}
          value={value}
          error={errors[fullId]}
          onChange={v => setValue(fullId, v)}
        />
      );
    }

    if (field.type === "select") {
      const value = typeof getIn(values, fullId) === "string" ? (getIn(values, fullId) as string) : "";

      return (
        <SelectField
          key={fullId}
          id={fullId}
          label={field.label}
          value={value}
          error={errors[fullId]}
          loadOptions={field.loadOptions}
          onChange={v => setValue(fullId, v)}
        />
      );
    }

    // group: render nested fields inside a fieldset
    if (field.type === "group") {
      return (
        <fieldset key={fullId}>
          <legend>{field.label}</legend>
          {field.fields.map(f => renderField(f, fullId))}
        </fieldset>
      );
    }

    // repeater: render array of items, with add/remove
    if (field.type === "repeater") {
      const arr = getIn(values, fullId);
      const items: Record<string, unknown>[] = Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];

      return (
        <div key={fullId}>
          <div>
            <span>{field.label}</span>
            <button
              type="button"
              onClick={() => {
                const nextItem: Record<string, unknown> = {};
                field.fields.forEach(child => {
                  if (child.type === "text" || child.type === "select") nextItem[child.id] = "";
                  if (child.type === "checkbox") nextItem[child.id] = false;
                });
                const nextArr = items.concat([nextItem]);
                setValue(fullId, nextArr);
              }}
            >
              Add
            </button>
          </div>

          {items.map((_, i) => (
            <div key={`${fullId}.${i}`}>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const next = items.slice();
                    next.splice(i, 1);
                    setValue(fullId, next);
                  }}
                >
                  Remove
                </button>
              </div>

              {field.fields.map(child => renderField(child, `${fullId}.${i}`))}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }
}
