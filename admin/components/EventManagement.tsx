"use client";

import { GoogleGenAI } from "@google/genai";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    BarChart,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Hash,
    LayoutGrid,
    Loader2,
    MapPin,
    Pencil,
    Plus,
    Sparkles,
    Tag,
    Trash2,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Event } from "../types";
import { cn } from "../utils";
import ErrorAlert from "./ErrorAlert";
import { ActionButton } from "./shared/ActionButton";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import { FeedbackToast } from "./shared/FeedbackToast";
import { Pagination } from "./shared/Pagination";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

interface EventManagementProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

interface ExtendedEvent extends Event {
  endDate?: string;
  endTime?: string;
  categoryId?: string;
  placeId?: string;
}

const EventManagement: React.FC<EventManagementProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [placesList, setPlacesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete" | "info";
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "price" | "capacity">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<ExtendedEvent | null>(
    null,
  );
  const [eventToView, setEventToView] = useState<ExtendedEvent | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    placeId: "",
    status: "UPCOMING",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    price: "",
    capacity: "",
    image: "",
  });

  const showFeedback = (
    type: "success" | "error" | "delete" | "info",
    message: string,
  ) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("perPage", itemsPerPage.toString());
      if (searchTerm) params.append("search", searchTerm);

      const [eventsRes, placesRes, catsRes, bookingRes] = await Promise.all([
        api.get<{ data: any[]; total?: number; count?: number }>(
          `/events?${params.toString()}`,
        ),
        api.get<{ data: any[] }>("/places?page=1&perPage=100"),
        api.categories.getAll(),
        api.get<{ data: any[] }>(`/bookings?page=1&perPage=100`),
      ]);

      if (placesRes && Array.isArray(placesRes.data))
        setPlacesList(placesRes.data);

      if (catsRes) {
        const catData = Array.isArray(catsRes)
          ? catsRes
          : (catsRes as any).data;
        if (Array.isArray(catData)) setCategoriesList(catData);
      }

      if (eventsRes && Array.isArray((eventsRes as any).data)) {
        const res = eventsRes as any;
        const serverTotal = res.total || res.count || 0;
        setTotalEvents(serverTotal || res.data.length);
        setHasMore(
          serverTotal > 0
            ? currentPage * itemsPerPage < serverTotal
            : res.data.length === itemsPerPage,
        );
        const mappedEvents = res.data.map((e: any) => {
          const startDateObj = new Date(e.startTime || e.date);
          const endDateObj = new Date(
            e.endTime || e.date || e.startTime || e.date,
          );
          return {
            id: e.id,
            title: e.title,
            description: e.description,
            category: e.category?.name || "General",
            status: (() => {
              if (
                e.status &&
                e.status !== "UPCOMING" &&
                e.status !== "COMPLETED"
              )
                return e.status;
              const now = new Date();
              if (now >= startDateObj && now <= endDateObj) return "ONGOING";
              return now > endDateObj ? "COMPLETED" : "UPCOMING";
            })(),
            date: startDateObj.toISOString(),
            endDate: endDateObj.toISOString(),
            time: startDateObj.toTimeString().substring(0, 5),
            endTime: endDateObj.toTimeString().substring(0, 5),
            location: e.place?.name || "Unknown Location",
            price: e.price,
            ticketsSold: e.bookingCount || 0,
            capacity: e.capacity,
            image: e.images?.[0]?.url || e.image || "",
            viewCount: e.viewCount || 0,
            bookingCount: e.bookingCount || 0,
            rating: e.avgRating || 0,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
            placeId: e.placeId,
            categoryId: e.categoryId,
          } as ExtendedEvent;
        });
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Failed to load events data", error);
      setError("Failed to load events data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage]);

  const filteredEvents = events
    .filter((e) => {
      const eDate = new Date(e.date).toISOString().split("T")[0];
      const catMatch =
        categoryFilter === "all" || e.category === categoryFilter;
      const startMatch = !startDate || eDate >= startDate;
      const endMatch = !endDate || eDate <= endDate;
      return catMatch && startMatch && endMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date")
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortBy === "title") comparison = a.title.localeCompare(b.title);
      else if (sortBy === "price") comparison = a.price - b.price;
      else if (sortBy === "capacity") comparison = a.capacity - b.capacity;
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFileToUpload(null);
    setPreviewImage("");
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      title: "",
      description: "",
      categoryId: categoriesList.length > 0 ? categoriesList[0].id : "",
      placeId: placesList.length > 0 ? placesList[0].id : "",
      status: "UPCOMING",
      date: today,
      time: "09:00",
      endDate: today,
      endTime: "17:00",
      price: "",
      capacity: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (event: ExtendedEvent) => {
    setEditingId(event.id);
    setFileToUpload(null);
    setPreviewImage(event.image || "");
    const catId =
      event.categoryId ||
      categoriesList.find((c) => c.name === event.category)?.id ||
      "";

    setFormData({
      title: event.title,
      description: event.description,
      categoryId: catId,
      placeId: event.placeId || "",
      status: event.status,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      endDate: event.endDate
        ? new Date(event.endDate).toISOString().split("T")[0]
        : new Date(event.date).toISOString().split("T")[0],
      endTime: event.endTime || "",
      price: event.price.toString(),
      capacity: event.capacity.toString(),
      image: event.image,
    });
    setIsDialogOpen(true);
  };

  const handleViewDetails = (event: ExtendedEvent) => {
    setEventToView(event);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (event: ExtendedEvent) => {
    if (isDeleting) return;
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      showFeedback(
        "info",
        "Please provide a title to generate relevant content.",
      );
      return;
    }
    setIsGeneratingAI(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set");
      const ai = new GoogleGenAI({ apiKey });
      const categoryName =
        categoriesList.find((c) => c.id === formData.categoryId)?.name ||
        "General";
      const prompt = `Write a compelling description for an event: "${formData.title}" (${categoryName}). Approx 50 words.`;
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });
      const text = response.text;
      if (text) {
        setFormData((prev) => ({ ...prev, description: text }));
        showFeedback("success", "Description generated successfully!");
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      showFeedback("error", "Failed to generate AI description.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let currentId = editingId;
      let finalImageUrl = formData.image;
      const isoStartTime = new Date(
        `${formData.date}T${formData.time}:00`,
      ).toISOString();
      const isoEndTime = new Date(
        `${formData.endDate || formData.date}T${formData.endTime || formData.time}:00`,
      ).toISOString();

      if (!currentId) {
        const payload = {
          title: formData.title,
          description: formData.description,
          placeId: formData.placeId,
          categoryId: formData.categoryId,
          date: isoStartTime,
          startTime: isoStartTime,
          endTime: isoEndTime,
          capacity: Number(formData.capacity),
          price: Number(formData.price),
          image: "",
        };
        const res = await api.post<{ id: string }>("/events", payload);
        currentId = res.id;
      }

      if (fileToUpload && currentId) {
        const uploadData = new FormData();
        uploadData.append("images", fileToUpload);
        const uploadRes = await api.post<{ data: any[] }>(
          `/events/${currentId}/images`,
          uploadData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (uploadRes.data?.[0]?.url) finalImageUrl = uploadRes.data[0].url;
      }

      if (currentId) {
        const payload = {
          title: formData.title,
          description: formData.description,
          placeId: formData.placeId,
          categoryId: formData.categoryId,
          date: isoStartTime,
          startTime: isoStartTime,
          endTime: isoEndTime,
          capacity: Number(formData.capacity),
          price: Number(formData.price),
          image: finalImageUrl,
          status: formData.status,
        };
        await api.put(`/events/${currentId}`, payload);
      }
      await fetchData();
      setIsDialogOpen(false);
      showFeedback(
        "success",
        `${editingId ? "Event updated" : "Event added"} successfully`,
      );
    } catch (error: any) {
      showFeedback(
        "error",
        error.response?.data?.message || "Failed to save event schedule.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      setIsDeleting(true);
      try {
        await api.delete(`/events/${eventToDelete.id}`);
        setEvents(events.filter((e) => e.id !== eventToDelete.id));
        showFeedback("delete", "Event deleted successfully");
        setIsDeleteDialogOpen(false);
        setEventToDelete(null);
      } catch (error) {
        showFeedback("error", "Failed to delete event.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "ONGOING":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    // Adjust for Monday start if desired, but standard is Sunday. Let's stick to Sunday start for now or standard.
    // Let's assume Sunday start (0) to match firstDayOfMonth.

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 rounded-xl"
        />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date.startsWith(dateStr));

      days.push(
        <div
          key={day}
          className="h-32 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-2 relative group hover:border-blue-500/30 transition-colors overflow-y-auto custom-scrollbar"
        >
          <span
            className={cn(
              "absolute top-2 right-2 text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
              dateStr === new Date().toISOString().split("T")[0]
                ? "bg-blue-500 text-white"
                : "text-gray-400 dark:text-zinc-500",
            )}
          >
            {day}
          </span>

          <div className="mt-6 flex flex-col gap-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleViewDetails(event)}
                className="text-[10px] p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 truncate cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border-l-2 border-blue-500"
                title={event.title}
              >
                <span className="font-bold opacity-75 mr-1">{event.time}</span>
                {event.title}
              </div>
            ))}
            {dayEvents.length === 0 && (
              <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      date: dateStr,
                      endDate: dateStr,
                    }));
                    handleOpenAdd();
                  }}
                >
                  <Plus size={14} className="text-gray-400" />
                </Button>
              </div>
            )}
          </div>
        </div>,
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="rounded-xl"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(new Date())}
              className="rounded-xl text-xs font-bold px-4 w-auto"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="rounded-xl"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-black uppercase text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">{days}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <Calendar className="text-blue-500" /> Events Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage all events and schedules.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {viewMode === "list" && (
              <>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Categories</option>
                  {categoriesList.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="capacity">Capacity</option>
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
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
              </>
            )}

            <Input
              type="search"
              placeholder="Date (YYYY-MM-DD)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full md:w-auto"
              disabled={viewMode === "calendar"}
            />

            <Button
              onClick={handleOpenAdd}
              className="gap-2 shrink-0 w-full md:w-auto font-black shadow-lg shadow-blue-500/20 rounded-xl text-[10px] uppercase tracking-widest"
            >
              <Plus size={16} /> Add Event
            </Button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={fetchData} />}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          </div>
        ) : viewMode === "calendar" ? (
          renderCalendar()
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const percentage =
                  event.capacity > 0
                    ? Math.round((event.ticketsSold / event.capacity) * 100)
                    : 0;
                return (
                  <Card
                    key={event.id}
                    className="h-[600px] flex flex-col group overflow-hidden border-gray-100 dark:border-zinc-800 shadow-lg hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1 transition-all rounded-[1.5rem] bg-white dark:bg-zinc-900 border"
                  >
                    <div className="relative h-1/2 bg-gray-200 dark:bg-zinc-800">
                      {event.image && (
                        <img
                          src={event.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md shadow-sm border border-white/10 text-white",
                            getStatusColor(event.status),
                          )}
                        >
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-black mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg">
                          <Tag size={10} /> {event.category}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/50 flex-1">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-blue-500 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] uppercase font-black text-gray-400">
                              Scheduled Duration
                            </span>
                            <span className="font-bold text-[10px] truncate">
                              {new Date(event.date).toLocaleDateString()}{" "}
                              {event.time}{" "}
                              <ArrowRight size={10} className="inline mx-1" />{" "}
                              {event.endDate
                                ? new Date(event.endDate).toLocaleDateString()
                                : "N/A"}{" "}
                              {event.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-red-500 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] uppercase font-black text-gray-400">
                              Place
                            </span>
                            <span className="font-bold text-[10px] truncate">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-1.5">
                          <span>{event.ticketsSold} Tickets Issued</span>
                          <span>{percentage}% of Capacity</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              percentage > 80 ? "bg-red-500" : "bg-blue-500",
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-500 font-bold text-[10px] uppercase tracking-wider hover:bg-blue-50 dark:hover:bg-blue-900/10"
                          onClick={() => handleViewDetails(event)}
                        >
                          <Eye size={14} className="mr-2" /> Details
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10"
                            onClick={() => handleOpenEdit(event)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <ActionButton
                            size="sm"
                            actionType="delete"
                            className="rounded-xl"
                            onClick={() => handleOpenDelete(event)}
                            loading={
                              isDeleting && eventToDelete?.id === event.id
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {!isLoading && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalEvents}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>
      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[700px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Update Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Enter event name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categoriesList.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={formData.placeId}
                  onChange={(e) =>
                    setFormData({ ...formData, placeId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  {placesList.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (ETB)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Capacity</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    required
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Media</Label>
                <label className="cursor-pointer flex items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 h-10 w-full px-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <LayoutGrid size={18} className="mr-2 text-gray-400" />
                  <span className="text-gray-500">
                    {fileToUpload ? fileToUpload.name : "Select Image File"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingAI}
                    className="h-6 text-xs text-purple-600 hover:text-purple-700"
                  >
                    {isGeneratingAI ? (
                      <Loader2 size={12} className="animate-spin mr-1" />
                    ) : (
                      <Sparkles size={12} className="mr-1" />
                    )}{" "}
                    AI Gen
                  </Button>
                </div>
                <textarea
                  className="w-full h-24 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide details about the event experience..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                type="button"
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
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className="sm:max-w-[900px] p-0 overflow-hidden border-0 [&>button]:hidden"
          onClose={() => setIsDetailOpen(false)}
        >
          {eventToView && (
            <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
              <div className="relative w-full md:w-2/5 h-48 md:h-full shrink-0 bg-gray-200 dark:bg-zinc-800">
                {eventToView.image ? (
                  <img
                    src={eventToView.image}
                    alt={eventToView.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Calendar size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md border border-white/10 w-fit text-white",
                      getStatusColor(eventToView.status),
                    )}
                  >
                    {eventToView.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold uppercase backdrop-blur-md border border-white/10 w-fit">
                    {eventToView.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 h-full overflow-hidden">
                <div className="p-6 pb-2 shrink-0 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">
                      {eventToView.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                      <MapPin size={16} className="text-red-500" />{" "}
                      {eventToView.location}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsDetailOpen(false)}
                    className="rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 -mr-2 -mt-2"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="p-6 pt-2 overflow-y-auto flex-1">
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 opacity-80">
                      Event Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-2">
                          <Clock size={12} className="text-blue-500" /> Schedule
                        </div>
                        <div className="text-xs font-bold leading-tight">
                          Starts:{" "}
                          {new Date(eventToView.date).toLocaleDateString()}{" "}
                          {eventToView.time}
                          <br />
                          Ends:{" "}
                          {eventToView.endDate
                            ? new Date(eventToView.endDate).toLocaleDateString()
                            : "N/A"}{" "}
                          {eventToView.endTime}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-2">
                          <Tag size={12} className="text-green-500" /> Entry
                          Price
                        </div>
                        <div className="text-lg font-black text-blue-600">
                          ETB {eventToView.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 opacity-80">
                      Attendance
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>{eventToView.ticketsSold} Sold</span>
                        <span>{eventToView.capacity} Capacity</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            eventToView.ticketsSold / eventToView.capacity > 0.8
                              ? "bg-red-500"
                              : "bg-blue-500",
                          )}
                          style={{
                            width: `${Math.min(100, (eventToView.ticketsSold / eventToView.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 opacity-80">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {eventToView.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-4">
                    <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <div className="text-[10px] text-gray-400 uppercase font-black mb-1 flex items-center gap-1">
                        <Hash size={10} />
                        ID
                      </div>
                      <div
                        className="font-mono text-[9px] truncate"
                        title={eventToView.id}
                      >
                        {eventToView.id}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <div className="text-[10px] text-gray-400 uppercase font-black mb-1 flex items-center gap-1">
                        <BarChart size={10} /> Views
                      </div>
                      <div className="font-black text-sm">
                        {eventToView.viewCount?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 font-black uppercase text-xs tracking-widest"
                      onClick={() => {
                        setIsDetailOpen(false);
                        handleOpenEdit(eventToView);
                      }}
                    >
                      <Pencil size={16} className="mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 px-4 text-red-500 border-red-100 hover:bg-red-50 h-11 font-black uppercase text-xs tracking-widest"
                      onClick={() => {
                        setIsDetailOpen(false);
                        handleOpenDelete(eventToView);
                      }}
                    >
                      <Trash2 size={18} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemType="Event"
        title="Delete Event"
        description={`Are you sure you want to delete "${eventToDelete?.title}"? This will permanently remove it from the database.`}
      />

      <FeedbackToast feedback={feedback} />
    </div>
  );
};

export default EventManagement;
