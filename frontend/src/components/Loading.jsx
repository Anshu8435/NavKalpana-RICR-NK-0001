import React from 'react';
import { Activity } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-[2.5px]',
    lg: 'h-14 w-14 border-3',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-[#20D9C2] border-r-[#13B8A6] border-b-[#0B1F33]/20 border-l-[#20D9C2] ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    ></div>
  );
};

export const PageLoading = ({ message = 'Evaluating Clinical Data...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
      <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#E0E8F0] shadow-card max-w-sm w-full mx-4 animate-fadeIn">
        <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#13B8A6]/20 animate-ping"></div>
          <div className="w-14 h-14 rounded-full bg-[#E8F8F4] flex items-center justify-center text-[#13B8A6] shadow-sm">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
        </div>
        <h3 className="font-display font-bold text-lg text-[#0B1F33] mb-1">CardioShield AI</h3>
        <p className="text-sm font-medium text-[#627487]">{message}</p>
      </div>
    </div>
  );
};

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
      className={`relative inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <LoadingSpinner size="sm" className="border-t-white border-r-white border-b-transparent border-l-white" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100 flex items-center gap-2 justify-center'}>
        {children}
      </span>
    </button>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0E8F0] shadow-card animate-pulse">
      <div className="h-5 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
      <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-6"></div>
      <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
    </div>
  );
};

export default { LoadingSpinner, PageLoading, LoadingButton, CardSkeleton };
