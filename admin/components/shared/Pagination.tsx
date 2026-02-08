"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
  hasMore,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const canGoNext = hasMore !== undefined ? hasMore : currentPage < totalPages;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
        className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4 h-9"
      >
        <ChevronLeft size={16} /> Previous
      </Button>

      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4 h-9"
      >
        Next <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export { Pagination };
