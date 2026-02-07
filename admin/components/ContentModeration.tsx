"use client";

import {
    AlertCircle,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Loader2,
    MessageSquare,
    ShieldCheck,
    Trash2,
    X,
    XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

interface ContentModerationProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

interface UnifiedItem {
  id: string;
  type: "BLOG" | "REVIEW";
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  media?: string;
  originalData: any;
}

const ContentModeration: React.FC<ContentModerationProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | "ALL"
  >("PENDING");

  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete";
    message: string;
  } | null>(null);

  const [dateFilter, setDateFilter] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  const showFeedback = (
    type: "success" | "error" | "delete",
    message: string,
  ) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    if (value === "all") {
      setDateFilter("");
    } else if (value === "today") {
      setDateFilter(`${year}-${month}-${day}`);
    } else if (value === "month") {
      setDateFilter(`${year}-${month}`);
    } else if (value === "year") {
      setDateFilter(`${year}`);
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusParam =
        statusFilter === "ALL" ? "" : `status=${statusFilter}`;

      const [blogRes, reviewRes] = await Promise.all([
        api
          .get<{ items: any[] }>(`/blog?${statusParam}&page=1&limit=50`)
          .catch(() => ({ items: [] })),
        api
          .get<{ items: any[] }>(`/reviews?${statusParam}&page=1&limit=50`)
          .catch(() => ({ items: [] })),
      ]);

      const blogItems: UnifiedItem[] = (blogRes.items || []).map(
        (post: any) => ({
          id: post.id,
          type: "BLOG",
          title: post.title,
          content: post.body || post.excerpt || "",
          author: {
            id: post.author?.id || "unknown",
            name: post.author?.profile?.name || post.author?.email || "Unknown",
            avatar:
              post.author?.profile?.avatar ||
              `https://ui-avatars.com/api/?name=${post.author?.email || "U"}`,
            role: "EDITOR",
          },
          category: post.category || "General",
          tags: post.tags || [],
          status: post.status === "PUBLISHED" ? "APPROVED" : post.status,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          media: post.media?.[0]?.url,
          originalData: post,
        }),
      );

      const reviewItems: UnifiedItem[] = (reviewRes.items || []).map(
        (review: any) => ({
          id: review.id,
          type: "REVIEW",
          title: review.placeId
            ? "Place Review"
            : review.eventId
              ? "Event Review"
              : "General Review",
          content: review.comment,
          author: {
            id: review.userId,
            name:
              review.user?.profile?.name ||
              review.user?.email ||
              "Unknown User",
            avatar: review.user?.profile?.avatar || "",
            role: "USER",
          },
          category: "Feedback",
          tags: [`Rating: ${review.rating}`],
          status: review.status,
          createdAt: review.createdAt,
          updatedAt: review.createdAt,
          media: undefined,
          originalData: review,
        }),
      );

      setItems([...blogItems, ...reviewItems]);
    } catch (error) {
      console.error("Failed to load moderation items", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const dateMatch = dateFilter ? item.createdAt.startsWith(dateFilter) : true;

    const localStatusMatch =
      statusFilter === "ALL" ||
      item.status === statusFilter ||
      (statusFilter === "APPROVED" && item.status === "PUBLISHED");

    return matchesSearch && dateMatch && localStatusMatch;
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const pendingCount = items.filter((i) => i.status === "PENDING").length;

  const handleStatusChange = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      if (item.type === "REVIEW") {
        const action = newStatus === "APPROVED" ? "APPROVE" : "REJECT";
        await api.post(`/reviews/admin/${id}/moderate`, {
          action: action,
          reason: "Admin dashboard action",
        });
      } else if (item.type === "BLOG") {
        const action = newStatus === "APPROVED" ? "APPROVE" : "REJECT";
        await api.post(`/blog/${id}/moderate`, {
          action: action,
          reason: "Admin dashboard action",
        });
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      showFeedback(
        "success",
        `Content ${newStatus.toLowerCase()} successfully.`,
      );
    } catch (error) {
      console.error("Moderation action failed", error);
      showFeedback("error", "Failed to update content status.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDeleteId) return;
    setIsDeleting(true);
    try {
      const item = items.find((i) => i.id === itemToDeleteId);
      if (item) {
        if (item.type === "BLOG") await api.delete(`/blog/${itemToDeleteId}`);
        else await api.delete(`/reviews/${itemToDeleteId}`);
      }
      setItems((prev) => prev.filter((item) => item.id !== itemToDeleteId));
      showFeedback("delete", "Item deleted successfully");
    } catch (e) {
      console.error("Delete failed", e);
      showFeedback("error", "Failed to delete item.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setItemToDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-500" />
              Moderation Management
            </h2>
            <p className="text-sm text-gray-500">
              Review and approve user-submitted Blog content.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <Select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="w-full md:w-[130px] font-bold text-xs uppercase tracking-widest rounded-xl"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
            <Input
              type="search"
              placeholder="YYYY-MM-DD"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                if (e.target.value === "") setTimeRange("all");
              }}
              className="w-full md:w-auto rounded-xl font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
            Filter Status:
          </span>
          <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-x-auto">
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap",
                statusFilter === "PENDING"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800",
              )}
            >
              <Clock size={14} /> PENDING ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap",
                statusFilter === "APPROVED"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800",
              )}
            >
              <CheckCircle size={14} /> APPROVED
            </button>
            <button
              onClick={() => setStatusFilter("REJECTED")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap",
                statusFilter === "REJECTED"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800",
              )}
            >
              <XCircle size={14} /> REJECTED
            </button>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === "ALL"
                  ? "bg-gray-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800",
              )}
            >
              SHOW ALL
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
            <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {searchTerm
                ? `No items found matching "${searchTerm}"`
                : `No items in ${statusFilter.toLowerCase()} queue.`}
            </p>
          </div>
        ) : (
          paginatedItems.map((item) => (
            <Card
              key={item.id}
              className="p-6 overflow-hidden flex flex-col md:row gap-6 hover:border-blue-500/30 transition-all shadow-lg hover:shadow-xl rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 group"
            >
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="shrink-0">
                  {item.media ? (
                    <img
                      src={item.media}
                      alt=""
                      className="w-full md:w-48 h-48 md:h-full rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full md:w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2",
                        item.type === "BLOG"
                          ? "bg-purple-50 text-purple-500 dark:bg-purple-900/20"
                          : "bg-blue-50 text-blue-500 dark:bg-blue-900/20",
                      )}
                    >
                      {item.type === "BLOG" ? (
                        <FileText size={32} />
                      ) : (
                        <MessageSquare size={32} />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {item.type}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                        item.status === "APPROVED" ||
                          item.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700",
                      )}
                    >
                      {item.status}
                    </span>
                    <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <Clock size={14} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={
                        item.author.avatar ||
                        `https://ui-avatars.com/api/?name=${item.author.name}`
                      }
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                      by {item.author.name}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 mb-6 flex-1">
                    <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-900/10 min-w-[120px] rounded-xl font-bold text-xs uppercase"
                      disabled={
                        processingId === item.id ||
                        item.status === "APPROVED" ||
                        item.status === "PUBLISHED"
                      }
                      onClick={() => handleStatusChange(item.id, "APPROVED")}
                    >
                      {processingId === item.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Check size={18} />
                      )}
                      {item.status === "APPROVED" || item.status === "PUBLISHED"
                        ? "Approved"
                        : "Approve"}
                    </Button>

                    <Button
                      variant="secondary"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 gap-2 min-w-[120px] rounded-xl font-bold text-xs uppercase"
                      disabled={
                        processingId === item.id || item.status === "REJECTED"
                      }
                      onClick={() => handleStatusChange(item.id, "REJECTED")}
                    >
                      {processingId === item.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <X size={18} />
                      )}
                      {item.status === "REJECTED" ? "Rejected" : "Reject"}
                    </Button>

                    <div className="ml-auto">
                      <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                        onClick={() => confirmDelete(item.id)}
                      >
                        <Trash2 size={18} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}

        {/* Pagination Controls */}
        {!isLoading && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-[400px]"
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this item? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {feedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in z-[9999] text-white",
            feedback.type === "success" ? "bg-green-600" : "bg-red-600",
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;
