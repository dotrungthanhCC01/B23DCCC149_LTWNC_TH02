import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import assignmentsReducer from "../features/assignments/assignmentsSlice";
import { AddAssignmentForm } from "../components/AddAssignmentForm";

const setup = () => {
  const store = configureStore({ reducer: { assignments: assignmentsReducer } });
  render(
    <Provider store={store}>
      <AddAssignmentForm />
    </Provider>,
  );
  return store;
};

const openForm = () => userEvent.click(screen.getByRole("button", { name: /Thêm bài tập mới/ }));

async function fill(title: string) {
  await userEvent.selectOptions(screen.getByLabelText("Môn học"), "Lập trình Web");
  await userEvent.type(screen.getByLabelText("Tên bài tập"), title);
  await userEvent.type(screen.getByLabelText("Hạn nộp"), "2099-12-31");
  await userEvent.selectOptions(screen.getByLabelText("Ưu tiên"), "high");
}

describe("component: AddAssignmentForm", () => {
  it("submit khi để trống không thêm bài tập (required)", async () => {
    const store = setup();
    await openForm();
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(store.getState().assignments.items).toHaveLength(0);
  });

  it("tên chỉ toàn khoảng trắng bị từ chối và hiện lỗi", async () => {
    const store = setup();
    await openForm();
    await fill("   ");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(screen.getByRole("alert")).toHaveTextContent("không được để trống");
    expect(store.getState().assignments.items).toHaveLength(0);
  });

  it("nhập hợp lệ thì dispatch addAssignment và đóng form", async () => {
    const store = setup();
    await openForm();
    await fill("  Bài mới  ");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));

    const items = store.getState().assignments.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      title: "Bài mới",
      subject: "Lập trình Web",
      deadline: "2099-12-31",
      priority: "high",
    });
    expect(screen.getByRole("button", { name: /Thêm bài tập mới/ })).toBeInTheDocument();
  });
});
