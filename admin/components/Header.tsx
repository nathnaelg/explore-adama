"use client";

import {
    Bell,
    Calendar,
    ChevronRight,
    Loader2,
    LogOut,
    MapPin,
    Menu,
    Moon,
    Search,
    Sun,
    User as UserIcon
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  title: string;
  searchValue?: string;
  onSearch?: (term: string) => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  user?: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "INFO" | "SUCCESS" | "WARNING" | "MESSAGE";
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleTheme,
  toggleMobileMenu,
  title,
  searchValue,
  onSearch,
  onNavigate,
  onLogout,
  user,
}) => {
  // State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<any>(user);

  // Search State
  const [quickResults, setQuickResults] = useState<{
    users: any[];
    places: any[];
    events: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load Notifications from Backend
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await api.get<Notification[]>("/notifications");
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        // Ignore if API fails, stay empty
      }
    };
    loadNotifications();
  }, []);

  // Fetch latest user profile to ensure header data is fresh
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const data = await api.get<any>(`/users/${user.id}`);
          if (data) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error("Failed to fetch fresh user profile", error);
        }
      }
    };

    // Initial set
    setUserProfile(user);

    // Fetch fresh
    fetchUserProfile();
  }, [user]);

  // Quick Search Effect (Client-Side Filtering)
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchValue || searchValue.length < 2) {
        setQuickResults(null);
        return;
      }

      setIsSearching(true);
      try {
        const lowerQ = searchValue.toLowerCase();

        // Fetch a larger batch of data since we filter client-side
        const [usersRes, placesRes, eventsRes] = await Promise.all([
          api
            .get<{ data: any[] }>("/users?perPage=100")
            .catch(() => ({ data: [] })),
          api
            .get<{ data: any[] }>("/places?perPage=100")
            .catch(() => ({ data: [] })),
          api
            .get<{ data: any[] }>("/events?perPage=100")
            .catch(() => ({ data: [] })),
        ]);

        const rawUsers = usersRes.data || [];
        const rawPlaces = placesRes.data || [];
        const rawEvents = eventsRes.data || [];

        // Client-side Filtering
        const filteredUsers = rawUsers
          .filter(
            (u: any) =>
              (u.email && u.email.toLowerCase().includes(lowerQ)) ||
              (u.profile?.name &&
                u.profile.name.toLowerCase().includes(lowerQ)) ||
              (u.name && u.name.toLowerCase().includes(lowerQ)),
          )
          .slice(0, 3);

        const filteredPlaces = rawPlaces
          .filter(
            (p: any) =>
              (p.name && p.name.toLowerCase().includes(lowerQ)) ||
              (p.category &&
                (typeof p.category === "string" ? p.category : p.category.name)
                  .toLowerCase()
                  .includes(lowerQ)),
          )
          .slice(0, 3);

        const filteredEvents = rawEvents
          .filter(
            (e: any) =>
              (e.title && e.title.toLowerCase().includes(lowerQ)) ||
              (e.location && e.location.toLowerCase().includes(lowerQ)),
          )
          .slice(0, 3);

        const hasResults =
          filteredUsers.length + filteredPlaces.length + filteredEvents.length >
          0;

        if (hasResults) {
          // Normalize data to avoid "Objects are not valid as a React child" errors
          const normalizeUser = (u: any) => ({
            ...u,
            // Ensure name is a string, even if profile is malformed
            name:
              (typeof u.profile === "object" ? u.profile?.name : u.name) ||
              u.email ||
              "User",
            avatar:
              (typeof u.profile === "object" ? u.profile?.avatar : u.avatar) ||
              null,
            email: u.email || "",
          });

          const normalizePlace = (p: any) => ({
            ...p,
            // If category is an object (relation), extract name. Else use as string.
            category:
              typeof p.category === "object"
                ? p.category?.name
                : p.category || "General",
            // Handle image arrays if backend returns them
            image:
              Array.isArray(p.images) && p.images[0]
                ? p.images[0].url
                : p.image || "",
          });

          const normalizeEvent = (e: any) => ({
            ...e,
            // Format date safely
            date: e.date
              ? new Date(e.date).toISOString()
              : new Date().toISOString(),
            // Flatten location if it's a relation
            location:
              typeof e.place === "object"
                ? e.place?.name
                : e.location || "Unknown Location",
          });

          setQuickResults({
            users: filteredUsers.map(normalizeUser),
            places: filteredPlaces.map(normalizePlace),
            events: filteredEvents.map(normalizeEvent),
          });
        } else {
          setQuickResults(null);
        }
      } catch (error) {
        console.error("Quick search failed", error);
        setQuickResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );
    setIsNotifOpen(false);
    onNavigate("/");
  };

  const handleSearchResultClick = (path: string) => {
    setIsSearchFocused(false);
    setQuickResults(null);
    onNavigate(path);
  };

  // Backdrop for mobile menus
  const Backdrop = ({ onClick }: { onClick: () => void }) => (
    <div className="fixed inset-0 z-40 bg-transparent" onClick={onClick} />
  );

  // User Info
  const activeUser = userProfile || user;
  const userName =
    activeUser?.profile?.name ||
    activeUser?.name ||
    activeUser?.email?.split("@")[0] ||
    "Admin";
  const userRole = activeUser?.role || "ADMIN";
  const userEmail = activeUser?.email || "";
  const userAvatar =
    activeUser?.profile?.avatar ||
    activeUser?.avatar ||
    `https://ui-avatars.com/api/?name=${userName}&background=random`;

  const userPhone = activeUser?.profile?.phone || "N/A";
  const userGender = activeUser?.profile?.gender || "N/A";
  const userCountry = activeUser?.profile?.country || "N/A";
  const userCity = activeUser?.profile?.locale || "N/A";

  return (
    <>
      {(isProfileOpen || isNotifOpen) && (
        <Backdrop
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotifOpen(false);
          }}
        />
      )}

      <header
        className={cn(
          "flex items-center justify-between px-4 md:px-6 py-3 md:py-4 mb-4 md:mb-6",
          "bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100",
          "rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300 relative",
          isProfileOpen || isNotifOpen ? "z-50" : "z-30",
        )}
      >
        {/* Left: Mobile Menu Trigger & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden -ml-2 text-gray-500"
          >
            <Menu size={24} />
          </Button>
          <div className="hidden md:block">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate">
              Welcome back
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{userName}</p>
          </div>
        </div>

        {/* Center: Search with Dropdown */}
        <div
          className="flex flex-1 items-center mx-3 md:mx-8 max-w-lg relative"
          ref={searchContainerRef}
        >
          <Search
            className="absolute left-3 md:left-4 text-gray-400 pointer-events-none"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search users, places, events..."
            className="pl-10 md:pl-12 py-6 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchValue || ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-blue-500 h-4 w-4" />
            </div>
          )}

          {/* Quick Search Dropdown */}
          {isSearchFocused &&
            searchValue &&
            searchValue.length > 1 &&
            quickResults && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                  {/* Users Section */}
                  {quickResults.users.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <UserIcon size={12} /> Users
                      </div>
                      {quickResults.users.map((u) => (
                        <div
                          key={u.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/users?q=${encodeURIComponent(u.email)}`,
                            )
                          }
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
                        >
                          <img
                            src={
                              u.avatar ||
                              `https://ui-avatars.com/api/?name=${u.name}`
                            }
                            className="w-8 h-8 rounded-full object-cover bg-gray-200"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-gray-900 dark:text-zinc-100">
                              {u.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {u.email}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Places Section */}
                  {quickResults.places.length > 0 && (
                    <div className="p-2 border-t border-gray-100 dark:border-zinc-800">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={12} /> Places
                      </div>
                      {quickResults.places.map((p) => (
                        <div
                          key={p.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/places?q=${encodeURIComponent(p.name)}`,
                            )
                          }
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
                        >
                          <img
                            src={p.image || ""}
                            className="w-8 h-8 rounded-lg object-cover bg-gray-200"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-gray-900 dark:text-zinc-100">
                              {p.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {p.category}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Events Section */}
                  {quickResults.events.length > 0 && (
                    <div className="p-2 border-t border-gray-100 dark:border-zinc-800">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={12} /> Events
                      </div>
                      {quickResults.events.map((e) => (
                        <div
                          key={e.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/events?q=${encodeURIComponent(e.title)}`,
                            )
                          }
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {new Date(e.date).getDate()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-gray-900 dark:text-zinc-100">
                              {e.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {e.location}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* View All Button */}
                <div className="p-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 text-center">
                  <button
                    onClick={() =>
                      handleSearchResultClick(
                        `/?q=${encodeURIComponent(searchValue || "")}`,
                      )
                    }
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline py-1"
                  >
                    View all results in Dashboard
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 dark:text-zinc-400"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 dark:text-zinc-400"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
              )}
            </Button>

            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-500"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-4 border-b hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer",
                          !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
                        )}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-semibold">{n.title}</h4>
                          <span className="text-[10px] text-gray-400">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t text-center">
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-500"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative pl-2 md:pl-4 md:border-l border-gray-200 dark:border-zinc-800 md:ml-2">
            <button
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
            >
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold leading-none">{userName}</p>
                <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wide">
                  {userRole}
                </p>
              </div>
              <img
                src={userAvatar}
                alt="Profile"
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover border-2 border-white dark:border-zinc-800 shadow-md bg-gray-100"
              />
            </button>

            {/* Profile Info Card (Detailed) */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-6 text-center border-b border-gray-100 dark:border-zinc-800">
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-gray-50 dark:border-zinc-800 bg-gray-100"
                  />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {userName}
                  </h3>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded uppercase tracking-wider">
                    {userRole}
                  </span>
                </div>
                <div className="p-4 space-y-3 bg-gray-50/50 dark:bg-zinc-950/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase">
                        Phone
                      </span>
                      <span className="font-medium text-gray-900 dark:text-zinc-300">
                        {userPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase">
                        Gender
                      </span>
                      <span className="font-medium text-gray-900 dark:text-zinc-300">
                        {userGender}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase">
                        Country
                      </span>
                      <span className="font-medium text-gray-900 dark:text-zinc-300">
                        {userCountry}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase">
                        City
                      </span>
                      <span className="font-medium text-gray-900 dark:text-zinc-300">
                        {userCity}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Logout Button in Dropdown */}
                <div className="p-2 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
