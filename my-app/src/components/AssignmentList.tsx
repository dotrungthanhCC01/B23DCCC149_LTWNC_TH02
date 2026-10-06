import { useCallback, useEffect, useMemo, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteAssignment,
  fetchAssignments,
  toggleComplete,
} from "../features/assignments/assignmentsSlice";
import type { Assignment } from "../features/assignments/types";
import { usePinStore } from "../features/pins/usePinStore";
import { useAssignmentFilter } from "../hooks/useAssignmentFilter";
import { useDebounce } from "../hooks/useDebounce";
import { AssignmentCard } from "./AssignmentCard";
import { isBaseline } from "../perfMode";

/** Chỉ ảo hoá khi danh sách đủ lớn; danh sách nhỏ render thường cho đơn giản. */
export const VIRTUALIZE_THRESHOLD = 100;
const ROW_HEIGHT = 104;
const LIST_HEIGHT = 560;

interface RowData {
  items: Assignment[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function Row({ index, style, items, onToggle, onDelete }: RowComponentProps<RowData>) {
  return (
    <div style={{ ...style, paddingBottom: 8 }}>
      <AssignmentCard assignment={items[index]} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export function AssignmentList() {
  const dispatch = useAppDispatch();
  const { items, filter, status } = useAppSelector((s) => s.assignments);
  const pinnedIds = usePinStore((s) => s.pinnedIds);
  const { filteredAssignments } = useAssignmentFilter(items, filter);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, isBaseline ? 0 : 300);

  useEffect(() => {
    if (status === "idle") dispatch(fetchAssignments());
  }, [dispatch, status]);

  // useCallback: giữ handler ổn định để React.memo của card có tác dụng.
  const handleToggle = useCallback((id: string) => dispatch(toggleComplete(id)), [dispatch]);
  const handleDelete = useCallback((id: string) => dispatch(deleteAssignment(id)), [dispatch]);

  // useMemo: lọc theo từ khoá (đã debounce) rồi đưa bài ghim lên đầu.
  const visible = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const matched = q
      ? filteredAssignments.filter(
          (a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q),
        )
      : filteredAssignments;
    if (pinnedIds.length === 0) return matched;
    const pinned = new Set(pinnedIds);
    const top: Assignment[] = [];
    const rest: Assignment[] = [];
    for (const a of matched) (pinned.has(a.id) ? top : rest).push(a);
    return top.concat(rest);
  }, [filteredAssignments, debouncedSearch, pinnedIds]);

  const rowProps = useMemo<RowData>(
    () => ({ items: visible, onToggle: handleToggle, onDelete: handleDelete }),
    [visible, handleToggle, handleDelete],
  );

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-2" aria-label="Đang tải">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3 animate-pulse">
            <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <p role="alert" className="text-sm text-red-500 text-center py-8">
        Không thể tải dữ liệu.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        id="search"
        type="search"
        aria-label="Tìm kiếm bài tập"
        placeholder="Tìm theo tên bài tập hoặc môn học..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-300"
      />

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Không có bài tập nào.</p>
      ) : visible.length > VIRTUALIZE_THRESHOLD && !isBaseline ? (
        <List
          rowComponent={Row}
          rowCount={visible.length}
          rowHeight={ROW_HEIGHT}
          rowProps={rowProps}
          style={{ height: LIST_HEIGHT }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((a) => (
            <AssignmentCard key={a.id} assignment={a} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
