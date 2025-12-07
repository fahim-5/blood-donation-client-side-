import { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiInfo, FiTrash2, FiLogOut } from 'react-icons/fi';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  type = "warning", // warning, danger, success, info
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  confirmColor = "red",
  icon = null,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Type configurations
  const typeConfigs = {
    warning: {
      icon: <FiAlertCircle className="text-yellow-500" size={24} />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      confirmColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    danger: {
      icon: <FiXCircle className="text-red-500" size={24} />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      confirmColor: "bg-red-600 hover:bg-red-700",
    },
    success: {
      icon: <FiCheckCircle className="text-green-500" size={24} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      confirmColor: "bg-green-600 hover:bg-green-700",
    },
    info: {
      icon: <FiInfo className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      confirmColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const config = typeConfigs[type] || typeConfigs.warning;

  // Custom icon mapping
  const customIcons = {
    delete: <FiTrash2 className="text-red-500" size={24} />,
    logout: <FiLogOut className="text-blue-500" size={24} />,
  };

  const displayIcon = icon && customIcons[icon] ? customIcons[icon] : config.icon;

  // Custom confirm color override
  const confirmBtnClass = confirmColor === "red" 
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    : confirmColor === "green"
    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
    : confirmColor === "blue"
    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    : confirmColor === "yellow"
    ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
    : config.confirmColor;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={handleBackdropClick}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${config.bgColor}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isLoading}
          >
            <FiXCircle size={20} />
          </button>

          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${config.bgColor.replace('50', '100')}`}>
                {displayIcon}
              </div>
            </div>

            <h3
              className="text-lg font-semibold text-gray-900 mb-2 text-center"
              id="modal-title"
            >
              {title}
            </h3>

            <div className="mt-2">
              <p className="text-gray-600 text-center">{message}</p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBtnClass} disabled:opacity-50 disabled:cursor-not-allowed flex-1`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;