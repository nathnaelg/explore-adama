"use client";

import { GoogleGenAI } from "@google/genai";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    FileText,
    Image as ImageIcon,
    Loader2,
    MessageSquare,
    Plus,
    Sparkles,
    ThumbsUp,
    Trash2,
    User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { BlogPost, Category, Comment } from "../types";
import { cn } from "../utils";
import { useAuth } from "./AuthProvider";
import ErrorAlert from "./ErrorAlert";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

interface ContentManagementProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

interface ExtendedBlogPost extends BlogPost {
  commentList?: Comment[];
}

const ContentManagement: React.FC<ContentManagementProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete";
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(false);

  const [dateFilter, setDateFilter] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "title" | "likes">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "post" | "comment";
  } | null>(null);
  const [postToView, setPostToView] = useState<ExtendedBlogPost | null>(null);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [postForm, setPostForm] = useState({
    title: "",
    body: "",
    category: "",
    tagsString: "",
    status: "PENDING",
  });

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

  const getImageUrl = (mediaItem: any) => {
    if (!mediaItem) return "";
    if (typeof mediaItem === "string") return mediaItem;
    const item = Array.isArray(mediaItem) ? mediaItem[0] : mediaItem;
    return item?.secure_url || item?.url || "";
  };

  const handleError = (error: any, action: string) => {
    console.error(`Failed to ${action}`, error);
    const msg =
      error.response?.data?.message || error.message || "Unknown error";
    showFeedback("error", `Failed to ${action}: ${msg}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<any>("/categories");
        const data = Array.isArray(res) ? res : res.data;
        if (Array.isArray(data)) setCategoriesList(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const [totalItems, setTotalItems] = useState(0); // Add totalItems state

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("q", searchTerm);
      if (categoryFilter !== "All")
        queryParams.append("category", categoryFilter);
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", itemsPerPage.toString());

      const res = await api.get<{ items: any[]; total?: number }>(
        `/blog?${queryParams.toString()}`,
      );

      if (res && res.items) {
        setHasMore(res.items.length === itemsPerPage);
        setTotalItems(res.total || 0); // Set total items from response
        const mappedPosts: BlogPost[] = res.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.body ? item.body.substring(0, 100) + "..." : "",
          content: item.body,
          author: item.author?.profile?.name || item.author?.email || "Unknown",
          authorAvatar: item.author?.profile?.avatar,
          image: getImageUrl(item.media || item.image),
          category: item.category || "General",
          tags: item.tags || [],
          date: item.createdAt,
          updatedAt: item.updatedAt,
          likes: 0,
          comments: item.comments?.length || 0,
          status: item.status,
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      setError("Failed to load blog posts. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, categoryFilter]);

  // Client-side filtering for date/sort only (applied to current page)
  const filteredPosts = posts
    .filter((post) => {
      const dateMatch = dateFilter ? post.date.startsWith(dateFilter) : true;
      // Category is already filtered by backend, but keeping safety check or removing it logic
      return dateMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date")
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortBy === "title") comparison = a.title.localeCompare(b.title);
      else if (sortBy === "likes") comparison = a.likes - b.likes;
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const paginatedPosts = filteredPosts;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleOpenAddPost = () => {
    setEditingPostId(null);
    setFileToUpload(null);
    setPreviewImage("");
    setPostForm({
      title: "",
      body: "",
      category: categoriesList.length > 0 ? categoriesList[0].name : "General",
      tagsString: "",
      status: "PENDING",
    });
    setIsPostDialogOpen(true);
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFileToUpload(null);
    setPreviewImage(post.image || "");
    setPostForm({
      title: post.title,
      body: post.content || "",
      category: post.category,
      tagsString: post.tags ? post.tags.join(", ") : "",
      status: (post.status as any) || "PENDING",
    });
    setIsPostDialogOpen(true);
  };

  const handleGenerateContent = async () => {
    if (!postForm.title) {
      alert("Please provide a title to generate relevant content.");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a comprehensive blog post body for title "${postForm.title}" in category "${postForm.category}". Use markdown. Approx 200 words.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const text = response.text;
      if (text) setPostForm((prev) => ({ ...prev, body: text }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const tagsArray = postForm.tagsString
      ? postForm.tagsString
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    try {
      const payload = {
        authorId: user?.id,
        title: postForm.title,
        body: postForm.body,
        category: postForm.category,
        tags: tagsArray,
      };

      let savedPostId = editingPostId;

      if (editingPostId) {
        await api.patch(`/blog/${editingPostId}`, payload);
      } else {
        const res = await api.post<{ id: string }>("/blog", payload);
        savedPostId = res.id;
      }

      if (savedPostId && fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        await api.post(`/blog/${savedPostId}/media`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchData();
      setIsPostDialogOpen(false);
      showFeedback(
        "success",
        editingPostId
          ? "Blog post updated successfully."
          : "Blog post created successfully.",
      );
    } catch (error) {
      handleError(error, "save post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (id: string, type: "post" | "comment") => {
    setItemToDelete({ id, type });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        if (itemToDelete.type === "post") {
          await api.delete(`/blog/${itemToDelete.id}`);
          setPosts(posts.filter((p) => p.id !== itemToDelete.id));
          showFeedback("delete", "Post deleted successfully.");
        } else {
          await api.delete(`/blog/comments/${itemToDelete.id}`);
          showFeedback("delete", "Comment deleted successfully");
        }
      } catch (error) {
        handleError(error, "delete item");
      } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <FileText className="text-blue-500" /> Blogs Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage all blog posts, edits, and deletions.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-[150px]"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-[120px]"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="likes">Likes</option>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
            </Button>
          </div>

          <Button
            onClick={handleOpenAddPost}
            className="gap-2 shrink-0 w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={18} /> New Post
          </Button>
        </div>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchData}
          onClose={() => setError(null)}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
              <p className="text-lg font-medium">No blog posts found.</p>
            </div>
          ) : (
            paginatedPosts.map((post) => (
              <Card
                key={post.id}
                className="h-[500px] group flex flex-col overflow-hidden border-gray-100 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="relative h-1/2 overflow-hidden bg-gray-200 dark:bg-zinc-800">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-zinc-800">
                      <ImageIcon size={32} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md shadow-sm border border-white/10",
                        post.status === "PUBLISHED" ||
                          post.status === "APPROVED"
                          ? "bg-green-500/90 text-white"
                          : post.status === "DRAFT"
                            ? "bg-gray-500/90 text-white"
                            : "bg-yellow-500/90 text-white",
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
                <CardContent className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[100px]">
                      <User size={12} /> {post.author}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                    <div className="flex gap-3 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {post.comments}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-500"
                        onClick={() => handleOpenEditPost(post)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleOpenDelete(post.id, "post")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
            disabled={currentPage >= totalPages || !hasMore || isLoading}
            className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
          onClose={() => setIsPostDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>
              {editingPostId ? "Edit Blog Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription>
              Apply changes to the blog registry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePost}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={postForm.title}
                    onChange={(e) =>
                      setPostForm({ ...postForm, title: e.target.value })
                    }
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={postForm.category}
                    onChange={(e) =>
                      setPostForm({ ...postForm, category: e.target.value })
                    }
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Media (Cover Image)</Label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors border border-gray-200 bg-white hover:bg-gray-100 text-gray-500 h-10 w-full px-3 dark:bg-zinc-900 dark:border-zinc-700">
                    <ImageIcon size={18} className="mr-2" />
                    {fileToUpload
                      ? fileToUpload.name
                      : previewImage
                        ? "Change Media"
                        : "Upload Media"}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {previewImage && (
                  <div className="mt-2 h-40 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Body Content</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-purple-600"
                    onClick={handleGenerateContent}
                    disabled={isGeneratingAI}
                  >
                    {isGeneratingAI ? (
                      <Loader2 size={12} className="animate-spin mr-1" />
                    ) : (
                      <Sparkles size={12} className="mr-1" />
                    )}
                    AI Writer
                  </Button>
                </div>
                <textarea
                  className="w-full min-h-[250px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                  placeholder="Write article body..."
                  value={postForm.body}
                  onChange={(e) =>
                    setPostForm({ ...postForm, body: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tags (Comma separated)</Label>
                  <Input
                    value={postForm.tagsString}
                    onChange={(e) =>
                      setPostForm({ ...postForm, tagsString: e.target.value })
                    }
                    placeholder="Travel, Adama, 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={postForm.status}
                    onChange={(e) =>
                      setPostForm({
                        ...postForm,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsPostDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {editingPostId ? "Updating..." : "Saving..."}
                  </>
                ) : editingPostId ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-[400px]"
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Delete{" "}
              {itemToDelete?.type === "post" ? "Post" : "Comment"}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.type}.
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
            feedback.type === "error"
              ? "bg-red-600"
              : feedback.type === "delete"
                ? "bg-red-500"
                : "bg-green-600",
          )}
        >
          {feedback.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
