import { FiUser, FiShield, FiUsers } from 'react-icons/fi';

const RoleBadge = ({ role, size = "md", showIcon = true }) => {
  const roleConfig = {
    donor: {
      label: "Donor",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <FiUser className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
    },
    volunteer: {
      label: "Volunteer",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FiUsers className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
    },
    admin: {
      label: "Admin",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <FiShield className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
    }
  };

  const config = roleConfig[role] || {
    label: role || "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <FiUser className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
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

export default RoleBadge;