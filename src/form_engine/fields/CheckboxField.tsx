type Props = {
  id: string;
  label: string;
  value?: boolean;
  error?: string;
  onChange: (value: boolean) => void;
  onBlur?: () => void;
};

export function CheckboxField({
  id,
  label,
  value = false,
  error,
  onChange
}: Props) {
  return (
    <div>
      <label>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={e => onChange(e.target.checked)}
          aria-checked={value}
          aria-invalid={!!error}
        />
        <span>{label}</span>
      </label>

      {error && (
        <p id={`${id}-error`} role="alert">{error}</p>
      )}
    </div>
  );
}