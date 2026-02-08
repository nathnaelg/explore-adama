import { Search } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../utils";
import { ICON_MAP } from "../utils/iconMap";
import { Input } from "./ui/input";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const iconNames = Object.keys(ICON_MAP);

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-2 max-h-[240px] overflow-y-auto bg-gray-50/50 dark:bg-zinc-900/50">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No icons found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = ICON_MAP[iconName];
              const isSelected = value === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => onChange(iconName)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 aspect-square group",
                    isSelected
                      ? "bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-200 dark:ring-blue-900"
                      : "hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                  title={iconName}
                >
                  <IconComponent
                    size={20}
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      isSelected && "scale-110",
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">
          {filteredIcons.length} icons found
        </span>
        <span
          className={cn(
            "font-mono font-medium",
            value ? "text-blue-600 dark:text-blue-400" : "text-gray-400",
          )}
        >
          {value || "No icon selected"}
        </span>
      </div>
    </div>
  );
};
