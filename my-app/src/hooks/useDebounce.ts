import { useEffect, useState } from "react";

/** Trả về giá trị đã trễ `delay` ms kể từ lần thay đổi cuối. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
