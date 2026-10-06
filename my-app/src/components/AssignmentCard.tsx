import { memo } from "react";
import type { Assignment } from "../features/assignments/types";
import { isOverdue } from "../features/assignments/types";
import { usePinStore } from "../features/pins/usePinStore";
import { DaysCounterBadge } from "./DaysCounterBadge";
import { countCardRender, isBaseline } from "../perfMode";

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_DOT: Record<Assignment["priority"], string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

// React.memo: card chỉ render lại khi assignment hoặc handler (đã useCallback) đổi.
// (Ở chế độ ?perf=baseline, memo bị tắt để lấy số đo "trước tối ưu".)
function AssignmentCardInner({
  assignment,
  onToggle,
  onDelete,
}: AssignmentCardProps) {
  countCardRender();
  const overdue = isOverdue(assignment);
  // Selector hẹp: chỉ card bị ghim/bỏ ghim mới render lại.
  const pinned = usePinStore((s) => s.pinnedIds.includes(assignment.id));
  const togglePin = usePinStore((s) => s.togglePin);

  return (
    <div
      data-testid={`card-${assignment.id}`}
      className={`bg-white border rounded-lg px-4 py-3 flex items-start gap-3
      ${overdue ? "border-red-200 bg-red-50/30" : "border-gray-200"}
      ${assignment.completed ? "opacity-60" : ""}
    `}
    >
      <button
        id={`toggle-${assignment.id}`}
        aria-label={assignment.completed ? "Bỏ hoàn thành" : "Hoàn thành"}
        onClick={() => onToggle(assignment.id)}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer
          ${
            assignment.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-gray-400"
          }`}
      >
        {assignment.completed && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[assignment.priority]}`} />
          <span className="text-xs text-gray-400 truncate">{assignment.subject}</span>
        </div>
        <p className={`text-sm font-medium text-gray-800 truncate ${assignment.completed ? "line-through text-gray-400" : ""}`}>
          {assignment.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            {new Date(assignment.deadline).toLocaleDateString("vi-VN")}
          </span>
          <span className="text-gray-300">·</span>
          <DaysCounterBadge deadline={assignment.deadline} completed={assignment.completed} />
        </div>
      </div>

      <button
        id={`pin-${assignment.id}`}
        aria-label={pinned ? "Bỏ ghim" : "Ghim"}
        aria-pressed={pinned}
        onClick={() => togglePin(assignment.id)}
        className={`flex-shrink-0 cursor-pointer mt-0.5 text-base leading-none transition-colors ${
          pinned ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500"
        }`}
        title={pinned ? "Bỏ ghim" : "Ghim"}
      >
        {pinned ? "★" : "☆"}
      </button>

      <button
        id={`delete-${assignment.id}`}
        aria-label="Xoá"
        onClick={() => onDelete(assignment.id)}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer mt-0.5"
        title="Xoá"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export const AssignmentCard = isBaseline ? AssignmentCardInner : memo(AssignmentCardInner);
