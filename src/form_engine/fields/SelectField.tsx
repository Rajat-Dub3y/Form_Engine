import { useEffect, useState, useRef } from "react";
import type { SelectOption } from "../types";

type Props = {
  id: string;
  label: string;
  value?: string;
  error?: string;
  loadOptions: () => Promise<SelectOption[]>;
  onChange: (value: string) => void;
};

export function SelectField({
  id,
  label,
  value,
  error,
  loadOptions,
  onChange
}: Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;

    let active = true;

    async function fetchOptions() {
      setLoading(true);

      try {
        const data = await loadOptions();
        if (active) setOptions(data);
      } catch {
        if (active) setLoadError("Failed to load options");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOptions();
    hasLoadedRef.current = true;

    return () => {
      active = false;
    };
  }, [loadOptions]);

  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <select
        id={id}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
        aria-busy={loading}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>
          {loading ? "Loading..." : "Select an option"}
        </option>

        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {loadError && (
        <p role="alert">{loadError}</p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert">{error}</p>
      )}
    </div>
  );
}
