import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '../utils';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  title, 
  message, 
  onClose, 
  onRetry, 
  className 
}) => {
  if (!message) return null;

  return (
    <div className={cn(
      "group bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm transition-all hover:shadow-md relative",
      className
    )}>
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 pr-6">
        {title && <h3 className="font-bold text-sm mb-1">{title}</h3>}
        <p className="text-sm opacity-90 leading-relaxed break-words">{message}</p>
        
        {onRetry && (
            <button 
                onClick={onRetry}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-xs font-bold transition-colors"
            >
                <RefreshCw size={12} /> Try Again
            </button>
        )}
      </div>
      {onClose && (
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-red-400 hover:text-red-700 dark:hover:text-red-200 transition-colors p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="Dismiss error"
        >
            <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;