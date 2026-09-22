import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const configs = {
    success: {
      bg: 'bg-[#E8F8F4]/80 border-[#13B8A6]/40 text-[#16866A]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#13B8A6] shrink-0" />,
    },
    error: {
      bg: 'bg-[#FDF2F3]/90 border-[#D94F59]/30 text-[#D94F59]',
      icon: <AlertCircle className="w-5 h-5 text-[#D94F59] shrink-0" />,
    },
    warning: {
      bg: 'bg-[#FEF6E7]/90 border-[#D49A27]/30 text-[#B45309]',
      icon: <AlertTriangle className="w-5 h-5 text-[#D49A27] shrink-0" />,
    },
    info: {
      bg: 'bg-[#F0F7FF]/90 border-[#123B5D]/20 text-[#123B5D]',
      icon: <Info className="w-5 h-5 text-[#13B8A6] shrink-0" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`backdrop-blur-sm border px-4 py-3.5 rounded-xl shadow-sm flex items-center justify-between gap-3 transition-all animate-fadeIn ${config.bg} ${className}`}>
      <div className="flex items-center gap-3">
        {config.icon}
        <span className="text-sm font-medium leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Dismiss alert"
          className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const ErrorMessage = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-[#FDF2F3]/90 border border-[#D94F59]/30 rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[#D94F59]/10 text-[#D94F59] shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-[#172B3A] font-semibold text-base mb-1">Clinical Exception</h3>
          <p className="text-[#627487] text-sm leading-relaxed mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="bg-[#0B1F33] hover:bg-[#123B5D] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              Retry Action
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyState = ({ 
  icon, 
  title = 'No Data Found', 
  message = 'There is nothing to display here yet.', 
  action,
  actionLabel = 'Get Started',
  className = ''
}) => {
  return (
    <div className={`text-center py-16 px-4 bg-white/60 border border-[#E0E8F0] rounded-2xl ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F8F4] flex items-center justify-center text-[#13B8A6] shadow-sm">
        {icon || <Info className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-[#172B3A] mb-1 font-display">{title}</h3>
      <p className="text-[#627487] text-sm mb-6 max-w-sm mx-auto leading-relaxed">{message}</p>
      {action && (
        <button
          onClick={action}
          type="button"
          className="bg-gradient-to-r from-[#0B1F33] to-[#123B5D] hover:from-[#123B5D] hover:to-[#1B4D78] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
