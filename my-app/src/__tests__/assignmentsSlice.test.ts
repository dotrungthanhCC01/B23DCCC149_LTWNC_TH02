import reducer, {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  setAssignments,
  setFilter,
  toggleComplete,
} from "../features/assignments/assignmentsSlice";
import type { Assignment } from "../features/assignments/types";

type State = ReturnType<typeof reducer>;

const item = (id: string, completed = false): Assignment => ({
  id,
  subject: "Toán rời rạc",
  title: `BT ${id}`,
  deadline: "2030-01-01",
  priority: "low",
  completed,
});

const withItems = (items: Assignment[]): State => ({
  ...reducer(undefined, { type: "init" }),
  items,
});

describe("unit: assignmentsSlice reducer", () => {
  it("trả về initial state", () => {
    expect(reducer(undefined, { type: "init" })).toEqual({
      items: [],
      filter: "all",
      status: "idle",
      error: null,
    });
  });

  it("addAssignment thêm vào đầu danh sách, completed = false", () => {
    const state = reducer(
      withItems([item("old")]),
      addAssignment({
        subject: "Lập trình Web",
        title: "Mới",
        deadline: "2030-02-02",
        priority: "high",
      }),
    );
    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toMatchObject({ title: "Mới", completed: false });
    expect(state.items[1].id).toBe("old");
  });

  it("toggleComplete đảo trạng thái hai chiều", () => {
    let state = reducer(withItems([item("1")]), toggleComplete("1"));
    expect(state.items[0].completed).toBe(true);
    state = reducer(state, toggleComplete("1"));
    expect(state.items[0].completed).toBe(false);
  });

  it("toggleComplete với id không tồn tại: không đổi gì (biên)", () => {
    const before = withItems([item("1")]);
    expect(reducer(before, toggleComplete("nope")).items).toEqual(before.items);
  });

  it("deleteAssignment xoá đúng phần tử; id lạ không ảnh hưởng (biên)", () => {
    const before = withItems([item("1"), item("2")]);
    expect(reducer(before, deleteAssignment("1")).items.map((a) => a.id)).toEqual(["2"]);
    expect(reducer(before, deleteAssignment("zzz")).items).toHaveLength(2);
  });

  it("setFilter và setAssignments", () => {
    expect(reducer(undefined, setFilter("overdue")).filter).toBe("overdue");
    const s = reducer(undefined, setAssignments([item("a"), item("b")]));
    expect(s.items).toHaveLength(2);
    expect(s.status).toBe("succeeded");
  });

  it("extraReducers: pending -> fulfilled -> rejected", () => {
    let s = reducer(undefined, fetchAssignments.pending("req"));
    expect(s.status).toBe("loading");

    s = reducer(s, fetchAssignments.fulfilled([item("x")], "req"));
    expect(s.status).toBe("succeeded");
    expect(s.items).toHaveLength(1);

    s = reducer(s, fetchAssignments.rejected(null, "req", undefined, "Lỗi mạng"));
    expect(s.status).toBe("failed");
    expect(s.error).toBe("Lỗi mạng");
  });
});
