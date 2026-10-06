import { useFormCtx } from "./FormContext";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  options: SelectOption[];
  required?: boolean;
  id?: string;
}

export function FormSelect({ name, options, required, id }: FormSelectProps) {
  const { values, setValue } = useFormCtx();

  return (
    <select
      id={id ?? name}
      name={name}
      value={values[name] ?? ""}
      required={required}
      onChange={(e) => setValue(name, e.target.value)}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
    >
      <option value="" disabled>Chọn...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
