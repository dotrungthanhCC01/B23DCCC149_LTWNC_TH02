import { useFormCtx } from "./FormContext";

interface FormInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  id?: string;
}

export function FormInput({ name, type = "text", placeholder, required, min, id }: FormInputProps) {
  const { values, setValue } = useFormCtx();

  return (
    <input
      id={id ?? name}
      name={name}
      type={type}
      value={values[name] ?? ""}
      placeholder={placeholder}
      required={required}
      min={min}
      onChange={(e) => setValue(name, e.target.value)}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-300"
    />
  );
}
