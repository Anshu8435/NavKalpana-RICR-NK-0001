// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-t-2 border-b-2 border-[#0a3d62] ${sizeClasses[size]} ${className}`}></div>
  );
};

// Full Page Loading
export const PageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

// Button with Loading State
export const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`relative ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingSpinner size="sm" className="border-white" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
};

// Card Loading Skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
};

export default { LoadingSpinner, PageLoading, LoadingButton, CardSkeleton };
