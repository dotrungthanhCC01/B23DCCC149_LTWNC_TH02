
export type Priority = "low" | "medium" | "high";
export type FilterStatus = "all" | "pending" | "overdue" | "completed";
export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  deadline: string; // ISO date string "YYYY-MM-DD"
  priority: Priority;
  completed: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export type AssignmentFormData = Omit<Assignment, "id" | "completed">;

export type PartialAssignment = Partial<Assignment>;

export type AssignmentDisplay = Pick<
  Assignment,
  "id" | "subject" | "title" | "deadline" | "priority" | "completed"
>;

export function isOverdue(assignment: Assignment): boolean {
  if (assignment.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(assignment.deadline);
  return deadline < today;
}

export function isCompleted(assignment: Assignment): boolean {
  return assignment.completed === true;
}

export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== "object" || obj === null) return false;
  const a = obj as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.subject === "string" &&
    typeof a.title === "string" &&
    typeof a.deadline === "string" &&
    typeof a.completed === "boolean" &&
    (a.priority === "low" || a.priority === "medium" || a.priority === "high")
  );
}

export function getDaysRemaining(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diff = deadlineDate.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
