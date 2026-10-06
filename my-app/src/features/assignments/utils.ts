import type { Assignment } from "./types";
import { getDaysRemaining, isOverdue } from "./types";

export interface AssignmentStats {
  total: number;
  completed: number;
  overdue: number;
  pending: number;
  bySubject: Record<string, number>;
}

/** Số ngày còn lại tới hạn nộp (âm nếu đã quá hạn). */
export function calcDaysLeft(deadline: string): number {
  return getDaysRemaining(deadline);
}

/** Thống kê: số bài đã xong, quá hạn, chờ nộp và số bài theo môn. */
export function calcStats(assignments: Assignment[]): AssignmentStats {
  const stats: AssignmentStats = {
    total: assignments.length,
    completed: 0,
    overdue: 0,
    pending: 0,
    bySubject: {},
  };
  for (const a of assignments) {
    if (a.completed) stats.completed++;
    else if (isOverdue(a)) stats.overdue++;
    else stats.pending++;
    stats.bySubject[a.subject] = (stats.bySubject[a.subject] ?? 0) + 1;
  }
  return stats;
}
