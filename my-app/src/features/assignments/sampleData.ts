import type { Assignment, Priority } from "./types";

const SUBJECTS = [
  "Cấu trúc dữ liệu & Giải thuật",
  "Lập trình Web",
  "Toán rời rạc",
  "Hệ điều hành",
  "Cơ sở dữ liệu",
  "Mạng máy tính",
  "Tiếng Anh Chuyên Ngành",
  "Chủ nghĩa xã hội khoa học",
];
const PRIORITIES: Priority[] = ["low", "medium", "high"];

/** Sinh `count` bài tập mẫu (dùng cho stress test). */
export function generateSampleAssignments(count: number): Assignment[] {
  const today = new Date();
  const result: Assignment[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + ((i * 7) % 60) - 20);
    result[i] = {
      id: `sample-${i + 1}`,
      subject: SUBJECTS[i % SUBJECTS.length],
      title: `Bài tập mẫu số ${i + 1}`,
      deadline: d.toISOString().split("T")[0],
      priority: PRIORITIES[i % PRIORITIES.length],
      completed: i % 5 === 0,
    };
  }
  return result;
}
