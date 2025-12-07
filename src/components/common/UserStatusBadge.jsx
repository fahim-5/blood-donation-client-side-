import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const UserStatusBadge = ({ status, size = "md", showIcon = true }) => {
  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <FiCheckCircle className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
    },
    blocked: {
      label: "Blocked",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <FiXCircle className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
    },
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: null
    },
    inactive: {
      label: "Inactive",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: null
    }
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: null
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  return (
    <span className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${config.color} ${sizeClasses[size]}
    `}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default UserStatusBadge;