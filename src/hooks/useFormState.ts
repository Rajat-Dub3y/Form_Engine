import { useState, useCallback } from "react";

export function useFormState() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = useCallback((fieldId: string, value: unknown) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const setAllValues = useCallback((next: Record<string, unknown>) => {
    setValues(next);
  }, []);

  return {
    values,
    errors,
    setValue,
    setErrors,
    setAllValues
  };
}