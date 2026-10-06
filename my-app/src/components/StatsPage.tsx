import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import { calcStats } from "../features/assignments/utils";

/** Trang Thống kê - được nạp lazy qua React.lazy. */
export default function StatsPage() {
  const items = useAppSelector((s) => s.assignments.items);
  const stats = useMemo(() => calcStats(items), [items]);
  const subjects = useMemo(
    () => Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1]),
    [stats],
  );

  const cards = [
    { label: "Tổng số", value: stats.total, color: "text-gray-800" },
    { label: "Đã xong", value: stats.completed, color: "text-green-600" },
    { label: "Quá hạn", value: stats.overdue, color: "text-red-500" },
    { label: "Chờ nộp", value: stats.pending, color: "text-yellow-600" },
  ];

  return (
    <section className="flex flex-col gap-4" aria-label="Thống kê">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Theo môn học</h2>
        <ul className="flex flex-col gap-2">
          {subjects.map(([name, count]) => (
            <li key={name} className="flex justify-between text-sm text-gray-600">
              <span>{name}</span>
              <span className="font-medium">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
