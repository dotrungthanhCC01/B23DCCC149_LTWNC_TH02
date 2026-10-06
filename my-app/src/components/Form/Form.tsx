// ============================================================
// Buổi 2 — Compound Component: Form (root)
// Expose sub-components qua Form.Item, Form.Label, Form.Input, Form.Select
// ============================================================

import React, { useState, useCallback } from "react";
import { FormContext } from "./FormContext";
import { FormItem } from "./FormItem";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

interface FormProps {
  children: React.ReactNode;
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void | boolean;
  className?: string;
}

function Form({ children, initialValues = {}, onSubmit, className }: FormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const setValue = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(values);
    // onSubmit trả về false (lỗi validate) thì giữ nguyên giá trị đã nhập
    if (result !== false) setValues(initialValues);
  };

  return (
    <FormContext.Provider value={{ values, setValue }}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Gắn sub-components vào Form — đây là Compound Component pattern
Form.Item = FormItem;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Select = FormSelect;

export { Form };
