import React from "react";

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor: string;
}

export function FormLabel({ children, htmlFor }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-500 mb-1">
      {children}
    </label>
  );
}
