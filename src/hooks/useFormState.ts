import { useState, useCallback } from "react";
import { getIn, setIn } from "../form_engine/utils";

export function useFormState() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = useCallback((fieldPath: string, value: unknown) => {
    setValues(prev => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      setIn(next, fieldPath, value);
      return next;
    });
  }, []);

  const getValue = useCallback((fieldPath: string) => {
    return getIn(values, fieldPath);
  }, [values]);

  const setAllValues = useCallback((next: Record<string, unknown>) => {
    setValues(next);
  }, []);

  return {
    values,
    errors,
    setValue,
    getValue,
    setErrors,
    setAllValues
  };
}