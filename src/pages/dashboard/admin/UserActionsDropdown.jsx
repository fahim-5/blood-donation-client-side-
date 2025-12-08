import React, { useState } from 'react';
import { FaEllipsisV, FaUserCheck, FaUserShield, FaBan, FaCheckCircle, FaUserSlash, FaUser, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const UserActionsDropdown = ({ user, currentUser, onStatusUpdate, onRoleUpdate, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    await onStatusUpdate(user._id, newStatus);
    setIsOpen(false);
  };

  const handleRoleUpdate = async (newRole) => {
    await onRoleUpdate(user._id, newRole);
    setIsOpen(false);
  };

  // Don't allow modifying self
  const isCurrentUser = user._id === currentUser?._id;

  const statusActions = [
    {
      label: user.status === 'active' ? 'Block User' : 'Unblock User',
      icon: user.status === 'active' ? <FaBan className="text-red-500" /> : <FaCheckCircle className="text-green-500" />,
      action: () => handleStatusUpdate(user.status === 'active' ? 'blocked' : 'active'),
      color: user.status === 'active' ? 'text-red-700 hover:bg-red-50' : 'text-green-700 hover:bg-green-50',
      disabled: isCurrentUser
    }
  ];

  const roleActions = [
    {
      label: 'Make Volunteer',
      icon: <FaUserCheck className="text-green-500" />,
      action: () => handleRoleUpdate('volunteer'),
      color: 'text-green-700 hover:bg-green-50',
      show: user.role === 'donor',
      disabled: isCurrentUser
    },
    {
      label: 'Make Admin',
      icon: <FaUserShield className="text-red-500" />,
      action: () => handleRoleUpdate('admin'),
      color: 'text-red-700 hover:bg-red-50',
      show: user.role === 'donor' || user.role === 'volunteer',
      disabled: isCurrentUser
    },
    {
      label: 'Make Donor',
      icon: <FaUser className="text-blue-500" />,
      action: () => handleRoleUpdate('donor'),
      color: 'text-blue-700 hover:bg-blue-50',
      show: user.role === 'volunteer' || user.role === 'admin',
      disabled: isCurrentUser
    }
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
      >
        <FaEllipsisV />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div className="py-1">
                {/* User Info */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role} • {user.status}
                  </div>
                </div>

                {/* Status Actions */}
                {statusActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={action.disabled || isLoading}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${action.color} ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}

                {/* Role Actions */}
                {roleActions.map((action, index) => 
                  action.show && (
                    <button
                      key={index}
                      onClick={action.action}
                      disabled={action.disabled || isLoading}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${action.color} ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </button>
                  )
                )}

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                >
                  <FaTimes />
                  <span>Close</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActionsDropdown;