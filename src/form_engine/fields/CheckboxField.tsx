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
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={e => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <span>{label}</span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}