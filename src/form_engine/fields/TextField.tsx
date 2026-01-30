type Props = {
  id: string;
  label: string;
  value?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

const TextField=({ id, label, value, error, onChange,onBlur }: Props)=>{
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export default TextField