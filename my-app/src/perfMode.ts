/**
 * Chế độ đo hiệu năng: mở `?perf=baseline` để TẮT các tối ưu (memo, debounce,
 * virtualization) làm mốc "trước khi tối ưu". Mặc định là bản đã tối ưu.
 */
export const isBaseline =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("perf") === "baseline";

declare global {
  interface Window {
    __cardRenders?: number;
  }
}

/** Đếm số lần AssignmentCard render (phục vụ báo cáo Profiler). */
export function countCardRender() {
  if (typeof window !== "undefined") window.__cardRenders = (window.__cardRenders ?? 0) + 1;
}
