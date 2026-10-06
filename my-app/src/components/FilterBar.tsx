import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilter } from "../features/assignments/assignmentsSlice";
import { useAssignmentFilter } from "../hooks/useAssignmentFilter";
import type { FilterStatus } from "../features/assignments/types";

const TABS: { id: FilterStatus; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chưa xong" },
  { id: "overdue", label: "Quá hạn" },
  { id: "completed", label: "Đã xong" },
];

export function FilterBar() {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector((s) => s.assignments);
  const { stats } = useAssignmentFilter(items, filter);

  const getCount = (id: FilterStatus) => {
    if (id === "all") return stats.total;
    if (id === "pending") return stats.pending;
    if (id === "overdue") return stats.overdue;
    return stats.completed;
  };

  return (
    <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
      {TABS.map((tab) => {
        const active = filter === tab.id;
        return (
          <button
            key={tab.id}
            id={`filter-${tab.id}`}
            onClick={() => dispatch(setFilter(tab.id))}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${active
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
              {getCount(tab.id)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
