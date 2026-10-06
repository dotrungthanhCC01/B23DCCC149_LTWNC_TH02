import { isOverdue, getDaysRemaining } from "../features/assignments/types";
import type { Assignment } from "../features/assignments/types";
import { calcDaysLeft, calcStats } from "../features/assignments/utils";
import { generateSampleAssignments } from "../features/assignments/sampleData";

const make = (over: Partial<Assignment> = {}): Assignment => ({
  id: "1",
  subject: "Lập trình Web",
  title: "Bài tập",
  deadline: "2026-06-15",
  priority: "medium",
  completed: false,
  ...over,
});

describe("unit: helpers", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });
  afterEach(() => jest.useRealTimers());

  describe("isOverdue", () => {
    it("true khi hạn đã qua và chưa xong", () => {
      expect(isOverdue(make({ deadline: "2026-06-10" }))).toBe(true);
    });
    it("false khi hạn ở tương lai", () => {
      expect(isOverdue(make({ deadline: "2026-06-20" }))).toBe(false);
    });
    it("false (biên) khi đã hoàn thành dù quá hạn", () => {
      expect(isOverdue(make({ deadline: "2020-01-01", completed: true }))).toBe(false);
    });
    it("false (biên) khi hạn là ngày mai", () => {
      expect(isOverdue(make({ deadline: "2026-06-16" }))).toBe(false);
    });
  });

  describe("calcDaysLeft", () => {
    it("dương khi còn hạn", () => {
      expect(calcDaysLeft("2026-06-18")).toBe(3);
    });
    it("0 khi hết hạn hôm nay (biên)", () => {
      expect(calcDaysLeft("2026-06-15")).toBe(0);
    });
    it("âm khi quá hạn", () => {
      expect(calcDaysLeft("2026-06-10")).toBe(-5);
      expect(getDaysRemaining("2026-06-10")).toBe(-5);
    });
  });

  describe("calcStats", () => {
    it("danh sách rỗng cho toàn số 0 (biên)", () => {
      expect(calcStats([])).toEqual({
        total: 0,
        completed: 0,
        overdue: 0,
        pending: 0,
        bySubject: {},
      });
    });
    it("đếm đúng đã xong / quá hạn / chờ nộp / theo môn", () => {
      const stats = calcStats([
        make({ id: "1", completed: true, subject: "A" }),
        make({ id: "2", deadline: "2026-06-01", subject: "A" }),
        make({ id: "3", deadline: "2026-07-01", subject: "B" }),
        make({ id: "4", deadline: "2026-07-02", subject: "B" }),
      ]);
      expect(stats).toMatchObject({ total: 4, completed: 1, overdue: 1, pending: 2 });
      expect(stats.bySubject).toEqual({ A: 2, B: 2 });
    });
  });
});

describe("generateSampleAssignments", () => {
  it("sinh đúng số lượng, id duy nhất", () => {
    const list = generateSampleAssignments(500);
    expect(list).toHaveLength(500);
    expect(new Set(list.map((a) => a.id)).size).toBe(500);
  });
  it("0 phần tử khi count = 0", () => {
    expect(generateSampleAssignments(0)).toEqual([]);
  });
});
