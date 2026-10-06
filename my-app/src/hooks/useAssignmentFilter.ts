
import { useMemo } from "react";
import type { Assignment, FilterStatus } from "../features/assignments/types";
import { isOverdue, isCompleted } from "../features/assignments/types";

export interface FilterStats {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

interface UseAssignmentFilterReturn {
  filteredAssignments: Assignment[];
  stats: FilterStats;
}

export function useAssignmentFilter(
  assignments: Assignment[],
  filter: FilterStatus
): UseAssignmentFilterReturn {
  const stats = useMemo<FilterStats>(() => {
    const completed = assignments.filter(isCompleted).length;
    const overdue = assignments.filter(isOverdue).length;
    const pending = assignments.filter(
      (a) => !isCompleted(a) && !isOverdue(a)
    ).length;
    return {
      total: assignments.length,
      pending,
      overdue,
      completed,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    switch (filter) {
      case "pending":
        return assignments.filter((a) => !isCompleted(a) && !isOverdue(a));
      case "overdue":
        return assignments.filter(isOverdue);
      case "completed":
        return assignments.filter(isCompleted);
      case "all":
      default:
        return assignments;
    }
  }, [assignments, filter]);

  return { filteredAssignments, stats };
}
