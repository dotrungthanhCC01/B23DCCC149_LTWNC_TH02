import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import assignmentsReducer from "../features/assignments/assignmentsSlice";
import { fetchAssignmentsApi } from "../features/assignments/mockApi";
import { usePinStore } from "../features/pins/usePinStore";
import { AssignmentList } from "../components/AssignmentList";
import type { Assignment } from "../features/assignments/types";

jest.mock("../features/assignments/mockApi", () => ({
  fetchAssignmentsApi: jest.fn(),
}));
const mockedApi = fetchAssignmentsApi as jest.MockedFunction<typeof fetchAssignmentsApi>;

const a = (id: string, title: string): Assignment => ({
  id,
  subject: "Mạng máy tính",
  title,
  deadline: "2099-01-01",
  priority: "low",
  completed: false,
});

const renderList = () => {
  const store = configureStore({ reducer: { assignments: assignmentsReducer } });
  render(
    <Provider store={store}>
      <AssignmentList />
    </Provider>,
  );
};

beforeEach(() => {
  mockedApi.mockReset();
  usePinStore.setState({ pinnedIds: [] });
});

describe("async: AssignmentList với API mock", () => {
  it("hiển thị trạng thái đang tải", () => {
    mockedApi.mockReturnValue(new Promise(() => {})); // không bao giờ resolve
    renderList();
    expect(screen.getByLabelText("Đang tải")).toBeInTheDocument();
  });

  it("tải thành công: hiển thị danh sách", async () => {
    mockedApi.mockResolvedValue({
      data: [a("1", "Bài một"), a("2", "Bài hai")],
      message: "ok",
      success: true,
    });
    renderList();
    expect(await screen.findByText("Bài một")).toBeInTheDocument();
    expect(screen.getByText("Bài hai")).toBeInTheDocument();
  });

  it("tải lỗi: hiển thị thông báo lỗi", async () => {
    mockedApi.mockRejectedValue(new Error("Network down"));
    renderList();
    expect(await screen.findByRole("alert")).toHaveTextContent("Không thể tải dữ liệu");
  });

  it("bài đã ghim luôn nằm đầu danh sách", async () => {
    usePinStore.setState({ pinnedIds: ["2"] });
    mockedApi.mockResolvedValue({
      data: [a("1", "Bài một"), a("2", "Bài hai")],
      message: "ok",
      success: true,
    });
    renderList();
    await waitFor(() => expect(screen.getByText("Bài một")).toBeInTheDocument());
    const titles = screen.getAllByText(/^Bài (một|hai)$/).map((el) => el.textContent);
    expect(titles).toEqual(["Bài hai", "Bài một"]);
  });
});
