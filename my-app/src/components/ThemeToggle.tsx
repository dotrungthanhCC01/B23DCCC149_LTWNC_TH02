import { memo } from "react";
import { useTheme } from "../context/ThemeContext";

/** Chỉ component này consume ThemeContext nên đổi theme không render lại phần còn lại. */
export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      id="btn-theme"
      onClick={toggleTheme}
      aria-label="Đổi giao diện sáng/tối"
      className="px-2 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
    >
      {theme === "light" ? "🌙 Tối" : "☀️ Sáng"}
    </button>
  );
});
