import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with frosted blur */}
      <div 
        className="fixed inset-0 bg-[#0B1F33]/60 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      
      {/* Modal Dialog */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-3xl shadow-2xl border border-[#E0E8F0] w-full ${sizeClasses[size]} transform transition-all animate-slideUp overflow-hidden`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-[#E0E8F0] px-6 sm:px-8 py-5 bg-[#F5F8FC]/60">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1F33] tracking-tight">{title}</h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  type="button"
                  aria-label="Close modal"
                  className="p-1.5 rounded-xl text-[#627487] hover:text-[#0B1F33] hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 sm:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  const configs = {
    danger: {
      btn: 'bg-[#D94F59] hover:bg-[#c0392b] text-white shadow-sm',
      iconBox: 'bg-[#FDF2F3] text-[#D94F59]',
      icon: <AlertTriangle className="w-8 h-8" />,
    },
    success: {
      btn: 'bg-[#16866A] hover:bg-[#0F766E] text-white shadow-sm',
      iconBox: 'bg-[#E8F8F4] text-[#16866A]',
      icon: <CheckCircle2 className="w-8 h-8" />,
    },
    primary: {
      btn: 'bg-[#0B1F33] hover:bg-[#123B5D] text-white shadow-sm',
      iconBox: 'bg-[#F0F7FF] text-[#123B5D]',
      icon: <HelpCircle className="w-8 h-8" />,
    },
  };

  const current = configs[type] || configs.primary;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-2">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${current.iconBox}`}>
          {current.icon}
        </div>
        <h3 className="text-xl font-bold font-display text-[#0B1F33] mb-2">{title}</h3>
        <p className="text-sm text-[#627487] mb-6 leading-relaxed max-w-xs mx-auto">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl border border-[#E0E8F0] font-semibold text-[#627487] hover:bg-slate-50 transition-colors text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all text-sm active:scale-95 ${current.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
