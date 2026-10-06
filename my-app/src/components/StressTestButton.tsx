import { memo } from "react";
import { useAppDispatch } from "../store/hooks";
import { setAssignments } from "../features/assignments/assignmentsSlice";
import { generateSampleAssignments } from "../features/assignments/sampleData";

export const StressTestButton = memo(function StressTestButton() {
  const dispatch = useAppDispatch();
  return (
    <button
      id="btn-stress"
      onClick={() => dispatch(setAssignments(generateSampleAssignments(10000)))}
      className="px-3 py-1.5 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 cursor-pointer"
    >
      Tạo 10.000 bài tập mẫu
    </button>
  );
});
