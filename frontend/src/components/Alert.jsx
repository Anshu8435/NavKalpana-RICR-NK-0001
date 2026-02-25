// Alert Component for Success/Error/Warning/Info messages

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'ℹ',
    },
  };

  const style = types[type] || types.info;

  return (
    <div className={`${style.bg} border ${style.border} ${style.text} px-4 py-3 rounded-xl flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{style.icon}</span>
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 font-bold text-lg`}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-2">Error Occurred</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon = '📭', 
  title = 'No Data Found', 
  message = 'There is nothing to display here yet.', 
  action,
  actionLabel = 'Get Started',
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button
          onClick={action}
          className="bg-[#0a3d62] hover:bg-[#3c6382] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default { Alert, ErrorMessage, EmptyState };
