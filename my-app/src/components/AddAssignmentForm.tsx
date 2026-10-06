import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addAssignment } from "../features/assignments/assignmentsSlice";
import type {
  AssignmentFormData,
  Priority,
} from "../features/assignments/types";
import { Form } from "./Form/Form";

const PRIORITY_OPTIONS = [
  { value: "high", label: "Cao" },
  { value: "medium", label: "Trung bình" },
  { value: "low", label: "Thấp" },
];

const SUBJECT_OPTIONS = [
  {
    value: "Cấu trúc dữ liệu & Giải thuật",
    label: "Cấu trúc dữ liệu & Giải thuật",
  },
  { value: "Lập trình Web", label: "Lập trình Web" },
  { value: "Toán rời rạc", label: "Toán rời rạc" },
  { value: "Hệ điều hành", label: "Hệ điều hành" },
  { value: "Cơ sở dữ liệu", label: "Cơ sở dữ liệu" },
  { value: "Mạng máy tính", label: "Mạng máy tính" },
  { value: "Tiếng Anh Chuyên Ngành", label: "Tiếng Anh Chuyên Ngành" },
  { value: "Chủ nghĩa xã hội khoa học", label: "Chủ nghĩa xã hội khoa học" },
  { value: "Khác", label: "Khác" },
];

const today = new Date().toISOString().split("T")[0];
const INITIAL_VALUES = { subject: "", title: "", deadline: "", priority: "" };

export function AddAssignmentForm() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (values: Record<string, string>) => {
    if (!values.title?.trim()) {
      setError("Tên bài tập không được để trống");
      return false;
    }
    setError(null);
    dispatch(
      addAssignment({
        subject: values.subject,
        title: values.title.trim(),
        deadline: values.deadline,
        priority: values.priority as Priority,
      } as AssignmentFormData),
    );
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        id="btn-open-form"
        onClick={() => setOpen(true)}
        className="w-full bg-white border border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
      >
        + Thêm bài tập mới
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">Bài tập mới</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
        >
          ×
        </button>
      </div>

      <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Form.Label htmlFor="subject">Môn học</Form.Label>
            <Form.Select
              name="subject"
              id="subject"
              options={SUBJECT_OPTIONS}
              required
            />
          </div>
          <div className="col-span-2">
            <Form.Label htmlFor="title">Tên bài tập</Form.Label>
            <Form.Input
              name="title"
              id="title"
              placeholder="Nhập tên bài tập..."
              required
            />
          </div>
          <div>
            <Form.Label htmlFor="deadline">Hạn nộp</Form.Label>
            <Form.Input
              name="deadline"
              id="deadline"
              type="date"
              min={today}
              required
            />
          </div>
          <div>
            <Form.Label htmlFor="priority">Ưu tiên</Form.Label>
            <Form.Select
              name="priority"
              id="priority"
              options={PRIORITY_OPTIONS}
              required
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500 mt-3">
            {error}
          </p>
        )}
        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="submit"
            id="btn-submit-form"
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Thêm
          </button>
        </div>
      </Form>
    </div>
  );
}
