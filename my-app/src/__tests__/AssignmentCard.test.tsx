import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssignmentCard } from "../components/AssignmentCard";
import { usePinStore } from "../features/pins/usePinStore";
import type { Assignment } from "../features/assignments/types";

const base: Assignment = {
  id: "a1",
  subject: "Lập trình Web",
  title: "Làm app React",
  deadline: "2099-01-01",
  priority: "high",
  completed: false,
};

beforeEach(() => usePinStore.setState({ pinnedIds: [] }));

describe("component: AssignmentCard", () => {
  it("hiển thị tên, môn học", () => {
    render(<AssignmentCard assignment={base} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Làm app React")).toBeInTheDocument();
    expect(screen.getByText("Lập trình Web")).toBeInTheDocument();
  });

  it("bài đã xong hiển thị nhãn 'Đã xong'", () => {
    render(
      <AssignmentCard assignment={{ ...base, completed: true }} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText(/Đã xong/)).toBeInTheDocument();
  });

  it("bấm nút hoàn thành gọi onToggle(id)", async () => {
    const onToggle = jest.fn();
    render(<AssignmentCard assignment={base} onToggle={onToggle} onDelete={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Hoàn thành" }));
    expect(onToggle).toHaveBeenCalledWith("a1");
  });

  it("bấm nút xoá gọi onDelete(id)", async () => {
    const onDelete = jest.fn();
    render(<AssignmentCard assignment={base} onToggle={jest.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: "Xoá" }));
    expect(onDelete).toHaveBeenCalledWith("a1");
  });

  it("bấm nút ghim bật/tắt trong usePinStore", async () => {
    render(<AssignmentCard assignment={base} onToggle={jest.fn()} onDelete={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Ghim" }));
    expect(usePinStore.getState().isPinned("a1")).toBe(true);
    expect(screen.getByRole("button", { name: "Bỏ ghim" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "Bỏ ghim" }));
    expect(usePinStore.getState().pinnedIds).toEqual([]);
  });
});
