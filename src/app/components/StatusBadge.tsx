interface StatusBadgeProps {
  status: 'Active' | 'Paused' | 'Completed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Paused: 'bg-orange-50 text-orange-700 border-orange-200',
    Completed: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
