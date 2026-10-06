import type { Assignment, ApiResponse } from "./types";
import { isAssignment } from "./types";

const MOCK_DATA: Assignment[] = [
  {
    id: "1",
    subject: "Cấu trúc dữ liệu & Giải thuật",
    title: "Bài tập cây AVL",
    deadline: getRelativeDate(2),
    priority: "high",
    completed: false,
  },
  {
    id: "2",
    subject: "Lập trình Web",
    title: "Xây dựng ứng dụng React + Redux",
    deadline: getRelativeDate(5),
    priority: "high",
    completed: false,
  },
  {
    id: "3",
    subject: "Toán rời rạc",
    title: "Bài tập đồ thị — BFS/DFS",
    deadline: getRelativeDate(-2),
    priority: "medium",
    completed: false,
  },
  {
    id: "4",
    subject: "Tiếng Anh Chuyên Ngành",
    title: "Viết báo cáo kỹ thuật",
    deadline: getRelativeDate(10),
    priority: "low",
    completed: false,
  },
  {
    id: "5",
    subject: "Hệ điều hành",
    title: "Báo cáo bài thực hành Process",
    deadline: getRelativeDate(-5),
    priority: "high",
    completed: true,
  },
  {
    id: "6",
    subject: "Cơ sở dữ liệu",
    title: "Thiết kế ERD và chuẩn hóa 3NF",
    deadline: getRelativeDate(1),
    priority: "medium",
    completed: false,
  },
  {
    id: "7",
    subject: "Mạng máy tính",
    title: "Bài tập chia subnet VLSM",
    deadline: getRelativeDate(7),
    priority: "low",
    completed: false,
  },
  {
    id: "8",
    subject: "Chủ nghĩa xã hội khoa học",
    title: "Tiểu luận cuối kỳ",
    deadline: getRelativeDate(-1),
    priority: "medium",
    completed: false,
  },
];

function getRelativeDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function fetchAssignmentsApi(): Promise<ApiResponse<Assignment[]>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const validated = MOCK_DATA.filter(isAssignment);
        resolve({
          data: validated,
          message: "Lấy dữ liệu thành công",
          success: true,
        });
      } catch {
        reject(new Error("Không thể lấy dữ liệu bài tập"));
      }
    }, 800);
  });
}
