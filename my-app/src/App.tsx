import { lazy, Suspense, useState } from "react";
import { useAppSelector } from "./store/hooks";
import { useAssignmentFilter } from "./hooks/useAssignmentFilter";
import { FilterBar } from "./components/FilterBar";
import { AddAssignmentForm } from "./components/AddAssignmentForm";
import { AssignmentList } from "./components/AssignmentList";
import { ThemeToggle } from "./components/ThemeToggle";
import { StressTestButton } from "./components/StressTestButton";

// React.lazy: trang Thống kê chỉ được tải khi người dùng mở tab.
const StatsPage = lazy(() => import("./components/StatsPage"));

type Page = "list" | "stats";

export default function App() {
  const { items, filter } = useAppSelector((s) => s.assignments);
  const { stats } = useAssignmentFilter(items, filter);
  const [page, setPage] = useState<Page>("list");

  const tabClass = (p: Page) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer ${
      page === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">📚 Deadline Tracker</h1>
            <p className="text-sm text-gray-400">Quản lý bài tập của bạn</p>
          </div>
          <div className="flex gap-3 items-center text-sm">
            <span className="px-2 py-1 bg-red-50 text-red-500 rounded font-medium">
              {stats.overdue} quá hạn
            </span>
            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded font-medium">
              {stats.pending} chờ nộp
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded font-medium">
              {stats.completed} xong
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
        <nav className="flex gap-2 items-center">
          <button id="tab-list" className={tabClass("list")} onClick={() => setPage("list")}>
            Danh sách
          </button>
          <button id="tab-stats" className={tabClass("stats")} onClick={() => setPage("stats")}>
            Thống kê
          </button>
          <div className="ml-auto">
            <StressTestButton />
          </div>
        </nav>

        {page === "list" ? (
          <>
            <AddAssignmentForm />
            <FilterBar />
            <AssignmentList />
          </>
        ) : (
          <Suspense fallback={<p className="text-sm text-gray-400 text-center py-8">Đang tải thống kê...</p>}>
            <StatsPage />
          </Suspense>
        )}
      </main>
    </div>
  );
}
