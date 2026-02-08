"use client";

import {
    ArrowDown,
    ArrowUp,
    Copy,
    Edit,
    Layers,
    Loader2,
    Plus,
    Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Category } from "../types";
import { ActionButton } from "./shared/ActionButton";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import { FeedbackToast } from "./shared/FeedbackToast";
import { Pagination } from "./shared/Pagination";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
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

interface CategoryManagementProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete";
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    icon: "grid-outline",
  });

  const showFeedback = (
    type: "success" | "error" | "delete",
    message: string,
  ) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.categories.getAll();
      let data: Category[] = [];

      if (Array.isArray(res)) {
        data = res;
      } else if (res && Array.isArray((res as any).data)) {
        data = (res as any).data;
      }

      setCategories(data);
      setHasMore(data.length > currentPage * itemsPerPage);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories
    .filter((cat) => {
      const term = (searchTerm || "").toLowerCase().trim();
      if (!term) return true;

      const nameMatch = (cat.name || "").toLowerCase().includes(term);
      const keyMatch = (cat.key || "").toLowerCase().includes(term);
      const idMatch = (cat.id || "").toLowerCase().includes(term);

      return nameMatch || keyMatch || idMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "count") {
        comparison = (a.count || 0) - (b.count || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", key: "", icon: "grid-outline" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      key: category.key,
      icon: (category as any).icon || "grid-outline",
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.categories.update(editingId, formData);
        showFeedback("success", "Category updated successfully");
      } else {
        await api.categories.create(formData);
        showFeedback("success", "Category added successfully");
      }
      await fetchCategories();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to save category", error);
      showFeedback(
        "error",
        error.response?.data?.message || "Failed to save category.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await api.categories.delete(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      showFeedback("delete", "Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category", error);
      showFeedback("error", "Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showFeedback("success", "ID copied to clipboard.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Layers className="text-blue-500" /> Categories Management
          </h2>
          <p className="text-sm text-gray-500">Manage categories.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-[130px]"
          >
            <option value="name">Name</option>
            <option value="key">Key</option>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown size={16} />
            )}
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
            <Plus size={18} /> Add Category
          </Button>
        </div>
      </div>

      <Card className="rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="border-b border-gray-50 dark:border-zinc-800 p-6 bg-gray-50/30 dark:bg-zinc-950/30 flex flex-col gap-1">
          <CardTitle className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">
            Category Control
          </CardTitle>
          <CardDescription className="text-xl font-black text-gray-900 dark:text-white leading-tight">
            Categories Registry
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500"
              data-testid="loader"
            >
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                      <th className="p-6 pl-8">Name</th>
                      <th className="p-6">Key</th>
                      <th className="p-6">ID</th>

                      <th className="p-6 text-right pr-8">Control</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-zinc-800">
                    {paginatedCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                        >
                          {searchTerm
                            ? `No categories matching "${searchTerm}"`
                            : "No categories found."}
                        </td>
                      </tr>
                    ) : (
                      paginatedCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group"
                        >
                          <td className="p-6 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shadow-sm">
                                {(category as any).icon ? (
                                  <span className="text-xs font-mono">
                                    {(category as any).icon.split("-")[0]}
                                  </span>
                                ) : (
                                  <Tag size={18} />
                                )}
                              </div>
                              <span className="font-black text-gray-900 dark:text-white text-sm">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="font-mono text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                              {category.key}
                            </span>
                          </td>
                          <td className="p-6">
                            <div
                              className="flex items-center gap-2 group/id cursor-pointer"
                              onClick={() => copyToClipboard(category.id)}
                              title="Click to copy"
                            >
                              <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                {category.id}
                              </span>
                              <Copy
                                size={12}
                                className="opacity-0 group-hover/id:opacity-100 text-gray-400"
                              />
                            </div>
                          </td>

                          <td className="p-6 text-right pr-8">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 rounded-xl"
                                onClick={() => handleOpenEdit(category)}
                              >
                                <Edit size={16} />
                              </Button>
                              <ActionButton
                                size="sm"
                                actionType="delete"
                                className="h-9 w-9 p-0 rounded-xl"
                                onClick={() => handleOpenDelete(category)}
                                loading={
                                  isDeleting &&
                                  categoryToDelete?.id === category.id
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredCategories.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update category details."
                : "Create a new category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Hotels"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="key" className="text-right">
                  Key
                </Label>
                <Input
                  id="key"
                  className="col-span-3"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  placeholder="unique-key"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Select
                  id="icon"
                  className="col-span-3"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                >
                  <option value="grid-outline">Grid (Default)</option>
                  <option value="location-outline">Location</option>
                  <option value="bed-outline">Bed (Hotels)</option>
                  <option value="restaurant-outline">Restaurant</option>
                  <option value="calendar-outline">Calendar (Events)</option>
                  <option value="cart-outline">Cart (Shopping)</option>
                  <option value="moon-outline">Moon (Nightlife)</option>
                  <option value="leaf-outline">Leaf (Nature)</option>
                  <option value="water-outline">Water (Spa)</option>
                  <option value="fitness-outline">Fitness</option>
                  <option value="camera-outline">Camera (Attractions)</option>
                  <option value="library-outline">Library (Historical)</option>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemType="Category"
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This will permanently remove it from the platform.`}
      />

      <FeedbackToast feedback={feedback} />
    </div>
  );
};

export default CategoryManagement;
