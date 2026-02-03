
import React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({
  children,
  open,
  onOpenChange,
}: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)}
      />
      {/* Content Container */}
      <div className="z-[9999] w-full max-w-lg flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full">
            {children}
        </div>
      </div>
    </div>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string; onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full transform overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-900 dark:border-zinc-800",
      className
    )}
    {...props}
  >
    {children}
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-white transition-opacity hover:bg-gray-100 hover:opacity-100 focus:outline-none dark:hover:bg-zinc-800 dark:ring-offset-zinc-950"
    >
      <X size={18} />
      <span className="sr-only">Close</span>
    </button>
  </div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2 sm:gap-0",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-zinc-100",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-zinc-400", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
