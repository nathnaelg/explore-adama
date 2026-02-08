"use client";

import { Loader2, LucideIcon, Pencil, Plus, Save, Trash2 } from "lucide-react";
import React from "react";
import { cn } from "../../utils";
import { Button, ButtonProps } from "../ui/button";

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: LucideIcon;
  actionType?: "delete" | "edit" | "add" | "save";
  label?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { loading, icon: Icon, actionType, label, children, className, ...props },
    ref,
  ) => {
    // Determine icon based on actionType if icon is not provided
    const getIcon = () => {
      if (Icon) return <Icon size={props.size === "sm" ? 14 : 16} />;

      switch (actionType) {
        case "delete":
          return <Trash2 size={props.size === "sm" ? 14 : 16} />;
        case "edit":
          return <Pencil size={props.size === "sm" ? 14 : 16} />;
        case "add":
          return <Plus size={props.size === "sm" ? 14 : 16} />;
        case "save":
          return <Save size={props.size === "sm" ? 14 : 16} />;
        default:
          return null;
      }
    };

    // Determine variant and className based on actionType
    const getDefaultVariant = () => {
      if (actionType === "delete") return "ghost";
      if (actionType === "add") return "default";
      if (actionType === "save") return "default";
      return props.variant || "default";
    };

    const combinedClassName = cn(
      actionType === "delete" &&
        "text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20",
      className,
    );

    return (
      <Button
        ref={ref}
        variant={getDefaultVariant()}
        disabled={loading || props.disabled}
        className={combinedClassName}
        {...props}
      >
        {loading ? (
          <Loader2
            size={props.size === "sm" ? 14 : 16}
            className={cn("animate-spin", label || children ? "mr-2" : "")}
          />
        ) : (
          getIcon() && (
            <span className={cn(label || children ? "mr-2" : "")}>
              {getIcon()}
            </span>
          )
        )}
        {label || children}
      </Button>
    );
  },
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
