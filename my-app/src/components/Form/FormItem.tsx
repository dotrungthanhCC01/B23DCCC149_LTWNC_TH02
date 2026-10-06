import React from "react";

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export function FormItem({ children, className = "" }: FormItemProps) {
  return <div className={className}>{children}</div>;
}
