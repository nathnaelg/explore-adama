"use client";

import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Ban,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Eye,
    FileText,
    Loader2,
    Mail,
    Pencil,
    Plus,
    ShieldAlert,
    ShoppingBag,
    Ticket,
    Trash2,
    UserCheck,
    User as UserIcon,
    UserX
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { BlogPost, Booking, User } from "../types";
import { cn } from "../utils";
import ErrorAlert from "./ErrorAlert";
import { ActionButton } from "./shared/ActionButton";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import { FeedbackToast } from "./shared/FeedbackToast";
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
import { Switch } from "./ui/switch";

interface UserManagementProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete";
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(
    null,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "blogs">(
    "profile",
  );

  const [dateFilter, setDateFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "email">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentUser = api.getUser();
  // Super Admin identifier
  const isSuperAdmin =
    currentUser?.email?.toLowerCase() === "amanueld2730@gmail.com";

  const showFeedback = (
    type: "success" | "error" | "delete",
    message: string,
  ) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const isProtectedAdmin = (user: User | null) => {
    if (!user) return false;
    return user.role === "ADMIN" && !isSuperAdmin;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: User[] }>(
        `/users?page=${currentPage}&perPage=${itemsPerPage}`,
      );
      const fetchedUsers = response.data || [];
      const serverTotal =
        (response as any).total || (response as any).count || 0;
      setUsers(fetchedUsers);
      setTotalUsers(serverTotal || fetchedUsers.length);
      setHasMore(
        serverTotal > 0
          ? currentPage * itemsPerPage < serverTotal
          : fetchedUsers.length === itemsPerPage,
      );
    } catch (error) {
      console.error("Failed to fetch users", error);
      setError("Failed to load user list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (id: string) => {
    setDetailLoading(true);
    setActiveTab("profile");
    try {
      const userRes = await api.get<User>(`/users/${id}`);
      const userData = (userRes as any).data || userRes;
      setSelectedUserDetail(userData);

      const bookingsRes = await api.get<{ data: Booking[] }>(
        "/bookings?perPage=100",
      );
      const allBookings = bookingsRes.data || [];
      setUserBookings(
        allBookings.filter(
          (b) => b.user?.id === id || (b as any).userId === id,
        ),
      );

      const blogsRes = await api.get<{ items: any[] }>("/blog?limit=100");
      const allBlogs = blogsRes.items || [];
      setUserBlogs(
        allBlogs
          .filter(
            (b) =>
              b.authorId === id ||
              b.author?.id === id ||
              b.author?.email === userData.email,
          )
          .map(
            (b) =>
              ({
                id: b.id,
                title: b.title,
                category: b.category,
                date: b.createdAt,
                status: b.status,
                excerpt: b.body?.substring(0, 60) + "...",
              }) as any,
          ),
      );
    } catch (err) {
      console.error("Failed to fetch user relations", err);
      setError("Could not load full user history.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserDetail(selectedUserId);
    } else {
      setSelectedUserDetail(null);
      setUserBookings([]);
      setUserBlogs([]);
    }
  }, [selectedUserId]);

  const filteredUsers = users
    .filter((user) => {
      const isNotCurrentUser = user.email !== currentUser?.email;
      const dateMatch = dateFilter
        ? user.createdAt.startsWith(dateFilter)
        : true;
      let roleMatch = !isSuperAdmin
        ? user.role === "TOURIST"
        : roleFilter === "all"
          ? true
          : user.role === roleFilter;
      const lowerSearch = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        user.email.toLowerCase().includes(lowerSearch) ||
        (user.profile?.name &&
          user.profile.name.toLowerCase().includes(lowerSearch));

      return dateMatch && isNotCurrentUser && roleMatch && searchMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date")
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortBy === "name")
        comparison = (a.profile?.name || "").localeCompare(
          b.profile?.name || "",
        );
      else if (sortBy === "email") comparison = a.email.localeCompare(b.email);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const isUserBanned = (u: User | null | undefined) => {
    if (!u) return false;
    return u.banned === true || String(u.banned) === "true";
  };

  const handleBlockToggle = async (user: User) => {
    if (isProtectedAdmin(user)) {
      showFeedback("error", "Insufficient privilege to modify this account.");
      return;
    }

    const currentlyBanned = isUserBanned(user);
    const newBannedStatus = !currentlyBanned;
    const actionLabel = currentlyBanned ? "UNBAN" : "BLOCK";
    setIsBlocking(true);

    try {
      await api.put(`/users/${user.id}`, { banned: newBannedStatus });
      await fetchUserDetail(user.id);
      await fetchUsers(); // Refresh the list to sync status
      showFeedback(
        "success",
        `User successfully ${actionLabel === "BLOCK" ? "suspended" : "restored"}.`,
      );
    } catch (error) {
      showFeedback("error", `Failed to ${actionLabel.toLowerCase()} user.`);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUserDetail) {
      if (isProtectedAdmin(selectedUserDetail)) {
        showFeedback("error", "Protected account deletion denied.");
        setIsDeleteDialogOpen(false);
        return;
      }
      setIsDeleting(true);
      try {
        await api.delete(`/users/${selectedUserDetail.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== selectedUserDetail.id));
        setSelectedUserId(null);
        showFeedback("delete", "User deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        showFeedback("error", "Failed to delete account.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TOURIST",
    banned: false,
  });

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // EDIT USER: Only Super Admin can change email/role
        const editPayload: any = {
          banned: formData.banned,
        };
        if (isSuperAdmin) {
          editPayload.email = formData.email;
          editPayload.role = formData.role;
        }
        await api.users.update(editingId, editPayload);
        showFeedback("success", "User updated successfully");
      } else {
        // ADD USER: email, password, name required. role only if super admin
        const payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: isSuperAdmin ? formData.role : "TOURIST",
        };
        await api.users.create(payload);
        showFeedback("success", "User added successfully");
      }

      await fetchUsers();
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Save user error:", err);
      showFeedback(
        "error",
        err.response?.data?.message || "Registry synchronization failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "TOURIST",
      banned: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.profile?.name || "",
      email: user.email,
      password: "",
      role: user.role,
      banned: user.banned === true || String(user.banned) === "true",
    });
    setIsDialogOpen(true);
  };

  return (
    <>
      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError(null)}
          onRetry={fetchUsers}
          className="mb-4"
        />
      )}

      {selectedUserId ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedUserId(null)}
                className="rounded-full"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">User Detail</h2>
                </div>
              </div>
            </div>

            <div className="ml-0 md:ml-auto flex gap-2">
              {selectedUserDetail && (
                <ActionButton
                  variant={
                    isUserBanned(selectedUserDetail) ? "default" : "destructive"
                  }
                  size="sm"
                  onClick={() => handleBlockToggle(selectedUserDetail)}
                  loading={isBlocking}
                  disabled={
                    detailLoading || isProtectedAdmin(selectedUserDetail)
                  }
                  icon={isUserBanned(selectedUserDetail) ? UserCheck : UserX}
                  label={isUserBanned(selectedUserDetail) ? "Unban" : "Ban"}
                  className={cn(
                    "shadow-sm transition-all min-w-[100px]",
                    isUserBanned(selectedUserDetail)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700",
                  )}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() =>
                  selectedUserDetail && handleOpenEdit(selectedUserDetail)
                }
              >
                <Pencil size={16} className="mr-2" /> Edit
              </Button>
              <ActionButton
                variant="ghost"
                size="sm"
                actionType="delete"
                onClick={() => setIsDeleteDialogOpen(true)}
                loading={isDeleting}
                label="Delete"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <CardContent className="pt-6">
                {detailLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-blue-500" />
                  </div>
                ) : selectedUserDetail ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <img
                          src={
                            selectedUserDetail.profile?.avatar ||
                            `https://ui-avatars.com/api/?name=${selectedUserDetail.email}`
                          }
                          className={cn(
                            "w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-zinc-800 transition-all",
                            isUserBanned(selectedUserDetail) &&
                              "grayscale opacity-50",
                          )}
                        />
                        {isUserBanned(selectedUserDetail) && (
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                            <ShieldAlert size={16} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">
                        {selectedUserDetail.profile?.name}
                      </h3>
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                          selectedUserDetail.role === "ADMIN"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600",
                        )}
                      >
                        {selectedUserDetail.role}
                      </span>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-300">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate">
                          {selectedUserDetail.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-300">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          Registered on{" "}
                          {new Date(
                            selectedUserDetail.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 flex flex-col min-h-[400px]">
              <div className="p-1 bg-gray-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 flex gap-1">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2",
                    activeTab === "bookings"
                      ? "bg-white dark:bg-zinc-900 shadow-sm text-blue-600"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <ShoppingBag size={14} /> Bookings ({userBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("blogs")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2",
                    activeTab === "blogs"
                      ? "bg-white dark:bg-zinc-900 shadow-sm text-blue-600"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <FileText size={14} /> Content ({userBlogs.length})
                </button>
              </div>

              <CardContent className="flex-1 p-6">
                {detailLoading ? (
                  <div className="h-full flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    {activeTab === "bookings" && (
                      <div className="space-y-4">
                        {userBookings.length === 0 ? (
                          <div className="text-center py-20 text-gray-400">
                            <Ticket
                              size={32}
                              className="mx-auto mb-2 opacity-20"
                            />
                            <p className="text-sm font-bold uppercase tracking-widest">
                              Empty Bookings
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {userBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center group hover:border-blue-500/30 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                                    <Ticket size={20} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm">
                                      {booking.event?.title || "Event Booking"}
                                    </h4>
                                    <p className="text-[10px] font-mono text-gray-400 uppercase">
                                      Ref #{booking.id.substring(0, 8)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-black">
                                    ETB {booking.total.toLocaleString()}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[9px] font-black uppercase tracking-wider",
                                      booking.status === "CONFIRMED"
                                        ? "text-green-600"
                                        : "text-yellow-600",
                                    )}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "blogs" && (
                      <div className="space-y-4">
                        {userBlogs.length === 0 ? (
                          <div className="text-center py-20 text-gray-400">
                            <FileText
                              size={32}
                              className="mx-auto mb-2 opacity-20"
                            />
                            <p className="text-sm font-bold uppercase tracking-widest">
                              No Content Found
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {userBlogs.map((blog) => (
                              <div
                                key={blog.id}
                                className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500/50 transition-all group cursor-pointer"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    {blog.category}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400">
                                    {new Date(blog.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="font-bold text-sm group-hover:text-blue-500 transition-colors">
                                  {blog.title}
                                </h4>
                                <div className="mt-2 flex justify-end">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-blue-500 font-bold uppercase text-[10px]"
                                  >
                                    View{" "}
                                    <ExternalLink size={10} className="ml-1" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <UserIcon className="text-blue-500" /> Users Management
              </h2>
              <p className="text-sm text-gray-500">Users Overview & Control</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-[130px] font-bold text-[10px] uppercase tracking-wider rounded-xl"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="rounded-xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </Button>
              </div>

              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-[130px] font-bold text-[10px] uppercase tracking-wider rounded-xl"
              >
                <option value="all">All</option>
                <option value="TOURIST">Tourist</option>
                <option value="ADMIN">Admin</option>
              </Select>
              <Button
                onClick={handleOpenAdd}
                className="gap-2 shrink-0 w-full sm:w-auto rounded-xl font-black shadow-lg shadow-blue-500/20 text-[10px] uppercase tracking-widest"
              >
                <Plus size={16} />
                Add User
              </Button>
            </div>
          </div>

          <Card className="rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                      <th className="p-6 pl-8">User</th>
                      <th className="p-6">Role</th>
                      <th className="p-6 hidden md:table-cell">Email</th>
                      <th className="p-6 hidden lg:table-cell">Joined</th>
                      <th className="p-6 text-right pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                        >
                          {searchTerm
                            ? `No users matching "${searchTerm}"`
                            : "No users found."}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <td className="p-6 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={
                                    user.profile?.avatar ||
                                    `https://ui-avatars.com/api/?name=${user.email}`
                                  }
                                  className={cn(
                                    "w-10 h-10 rounded-xl object-cover shadow-sm border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900",
                                    isUserBanned(user) &&
                                      "grayscale opacity-50",
                                  )}
                                />
                                {isUserBanned(user) && (
                                  <div className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 rounded-full border border-white shadow-sm">
                                    <Ban size={8} />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-gray-900 dark:text-white text-sm truncate max-w-[150px]">
                                  {user.profile?.name || "Authorized Node"}
                                </span>
                                <span
                                  className={cn(
                                    "text-[8px] font-bold uppercase tracking-wider",
                                    isUserBanned(user)
                                      ? "text-red-500"
                                      : "text-green-500",
                                  )}
                                >
                                  {isUserBanned(user) ? "Banned" : "Active"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span
                              className={cn(
                                "text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider border",
                                user.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30"
                                  : "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30",
                              )}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-6 hidden md:table-cell">
                            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                              {user.email}
                            </span>
                          </td>
                          <td className="p-6 hidden lg:table-cell">
                            <span className="text-xs font-bold text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td
                            className="p-6 text-right pr-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 rounded-lg"
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-zinc-800 rounded-lg"
                                onClick={() => handleOpenEdit(user)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg"
                                onClick={() => {
                                  setSelectedUserDetail(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                  >
                    <ChevronLeft size={16} /> Previous
                  </Button>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Page {currentPage} of {Math.ceil(totalUsers / itemsPerPage)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      currentPage >= Math.ceil(totalUsers / itemsPerPage) ||
                      !hasMore ||
                      loading
                    }
                    className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingId ? "Update User Credentials" : "Add New User"}
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[9px] tracking-widest">
              {editingId
                ? "Updating user credentials"
                : "Initializing new user credentials"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUser} autoComplete="off">
            {/* Security Sentinel: Aggressively prevent browser from capturing current admin credentials */}
            <div className="sr-only" aria-hidden="true">
              <input
                type="text"
                name={`node_key_${Math.random().toString(36).substring(7)}`}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="password"
                name={`pass_key_${Math.random().toString(36).substring(7)}`}
                tabIndex={-1}
                autoComplete="new-password"
              />
            </div>

            <div className="grid gap-6 py-6">
              {/* Display Name - Mandatory for Adding */}
              {!editingId && (
                <div className="space-y-2">
                  <Label className="font-black uppercase text-[10px] tracking-widest text-gray-400">
                    Name
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="rounded-2xl h-12 bg-gray-50 dark:bg-zinc-950 font-bold"
                    placeholder="Enter full name"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-black uppercase text-[10px] tracking-widest text-gray-400">
                  Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="off"
                  // Edit email only if super admin
                  disabled={editingId !== null && !isSuperAdmin}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="rounded-2xl h-12 bg-gray-50 dark:bg-zinc-950 font-bold"
                  placeholder="user@explore-adama.com"
                />
              </div>

              {!editingId && (
                <div className="space-y-2">
                  <Label className="font-black uppercase text-[10px] tracking-widest text-gray-400">
                    Password
                  </Label>
                  <Input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="rounded-2xl h-12 bg-gray-50 dark:bg-zinc-950"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Role Selection: Only for Super Admin during creation or edit */}
                {(isSuperAdmin || (editingId !== null && isSuperAdmin)) && (
                  <div className="space-y-2">
                    <Label className="font-black uppercase text-[10px] tracking-widest text-gray-400">
                      Role
                    </Label>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      disabled={!isSuperAdmin}
                      className="rounded-2xl h-12 font-black text-xs uppercase tracking-widest"
                    >
                      <option value="TOURIST">Tourist</option>
                      <option value="ADMIN">Admin</option>
                    </Select>
                  </div>
                )}

                {editingId && (
                  <div className="space-y-2">
                    <Label className="font-black uppercase text-[10px] tracking-widest text-gray-400">
                      Status
                    </Label>
                    <div className="flex items-center gap-3 h-12 px-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                      <Switch
                        checked={!formData.banned}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, banned: !checked })
                        }
                      />
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-wider",
                          formData.banned ? "text-red-500" : "text-green-500",
                        )}
                      >
                        {formData.banned ? "Banned" : "Active"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-2xl h-12 px-6 font-bold uppercase text-[10px] tracking-widest"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingId ? "Update User" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
        itemType="User Account"
        title="Delete User"
        description="This action cannot be undone. This will permanently delete the user account and all associated data."
      />

      <FeedbackToast feedback={feedback} />
    </>
  );
};

export default UserManagement;
