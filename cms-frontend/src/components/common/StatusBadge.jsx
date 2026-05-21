function StatusBadge({ status }) {
  const colors = {
    DRAFT: "bg-gray-500",
    PENDING: "bg-yellow-500",
    PUBLISHED: "bg-green-600",
    REJECTED: "bg-red-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;