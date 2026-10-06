import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../hooks/useDebounce";

describe("hook: useDebounce", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("chỉ cập nhật giá trị sau 300ms và bỏ qua giá trị trung gian", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "a" },
    });
    expect(result.current).toBe("a");

    rerender({ v: "ab" });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    rerender({ v: "abc" }); // reset timer
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("abc");
  });
});
