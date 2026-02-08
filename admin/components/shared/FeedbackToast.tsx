"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";
import { cn } from "../../utils";

export type FeedbackType = "success" | "error" | "delete";

interface FeedbackToastProps {
  feedback: {
    type: FeedbackType;
    message: string;
  } | null;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in z-[9999] text-white",
        feedback.type === "error"
          ? "bg-red-600"
          : feedback.type === "delete"
            ? "bg-red-500"
            : "bg-green-600",
      )}
    >
      {feedback.type === "error" || feedback.type === "delete" ? (
        <AlertCircle size={20} />
      ) : (
        <CheckCircle size={20} />
      )}
      <span className="font-medium text-sm">{feedback.message}</span>
    </div>
  );
};

export { FeedbackToast };
