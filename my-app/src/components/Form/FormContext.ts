// ============================================================
// Buổi 2 — Compound Component: FormContext
// ============================================================

import { createContext, useContext } from "react";

export interface FormContextValue {
  values: Record<string, string>;
  setValue: (name: string, value: string) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormCtx(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormCtx phải được dùng trong <Form>");
  }
  return ctx;
}
