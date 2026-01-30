type Props = {
  id: string;
  label: string;
  value?: string;
  error?: string;
  validating?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

const TextField = ({ id, label, value, error, validating, onChange, onBlur }: Props) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {validating ? <div aria-live="polite">Validating…</div> : null}
      {error && <p id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
export default TextField