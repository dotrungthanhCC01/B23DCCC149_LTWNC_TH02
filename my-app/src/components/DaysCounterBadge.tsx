import { getDaysRemaining } from "../features/assignments/types";

interface DaysCounterBadgeProps {
  deadline: string;
  completed: boolean;
}

export function DaysCounterBadge({ deadline, completed }: DaysCounterBadgeProps) {
  if (completed) {
    return <span className="text-xs text-green-600 font-medium">✓ Đã xong</span>;
  }

  const days = getDaysRemaining(deadline);

  if (days < 0) {
    return (
      <span className="text-xs text-red-500 font-medium">
        Quá hạn {Math.abs(days)} ngày
      </span>
    );
  }
  if (days === 0) {
    return <span className="text-xs text-orange-500 font-medium">Hôm nay hết hạn</span>;
  }
  if (days <= 3) {
    return <span className="text-xs text-yellow-600 font-medium">Còn {days} ngày</span>;
  }
  return <span className="text-xs text-gray-400">Còn {days} ngày</span>;
}
