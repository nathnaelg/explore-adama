"use client";

import {
  BrainCircuit,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  LayoutGrid,
  LogOut,
  MapPin,
  PieChart,
  Settings,
  ShieldAlert,
  Ticket,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { cn } from "../utils";

interface SidebarProps {
  isDarkMode: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  onLogout: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  currentPath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isDarkMode,
  isCollapsed,
  toggleSidebar,
  isMobileMenuOpen,
  toggleMobileMenu,
  onLogout,
  activeTab,
  setActiveTab,
  currentPath,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" },
    { id: "users", label: "Users", icon: Users, href: "/users" },
    { id: "places", label: "Places", icon: MapPin, href: "/places" },
    {
      id: "categories",
      label: "Categories",
      icon: Layers,
      href: "/categories",
    },
    { id: "events", label: "Events", icon: Calendar, href: "/events" },
    { id: "tickets", label: "Tickets", icon: Ticket, href: "/tickets" },
    {
      id: "moderation",
      label: "Moderation",
      icon: ShieldAlert,
      href: "/moderation",
    },
    { id: "content", label: "Blog", icon: FileText, href: "/content" },
    { id: "analytics", label: "Analytics", icon: PieChart, href: "/analytics" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      <aside
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 ease-in-out border border-gray-100 dark:border-zinc-800",
          "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 shadow-2xl",
          "fixed inset-y-0 left-0 z-[1000] w-72 m-0 rounded-none h-full",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:m-4 md:rounded-3xl",
          isCollapsed ? "md:w-20" : "md:w-72",
        )}
      >
        {/* Logo Area */}
        <div
          className={cn(
            "p-6 flex items-center h-24 transition-all duration-300 relative border-b border-gray-100 dark:border-zinc-800",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 shrink-0">
            E
          </div>
          <div
            className={cn(
              "flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300",
              isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100",
            )}
          >
            <span className="font-bold text-lg dark:text-white text-slate-800">
              explore-adama
            </span>
            <span className="text-xs text-gray-400">Admin Portal</span>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 space-y-2 overflow-y-auto overflow-x-hidden py-4 transition-all duration-300",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
            isCollapsed ? "px-2" : "px-4",
          )}
        >
          <div
            className={cn(
              "hidden md:flex relative items-center h-10 mb-4",
              isCollapsed ? "px-0 justify-center" : "px-2",
            )}
          >
            <div
              className={cn(
                "absolute left-2 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap transition-all duration-300",
                isCollapsed
                  ? "opacity-0 -translate-x-4"
                  : "opacity-100 translate-x-0",
              )}
            >
              Main Menu
            </div>

            <button
              onClick={toggleSidebar}
              className={cn(
                "absolute p-1.5 rounded-lg transition-all duration-300 z-10 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700",
                "text-gray-500 hover:bg-gray-100 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-white",
                isCollapsed
                  ? "left-1/2 -translate-x-1/2"
                  : "right-0 translate-x-0",
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>

          <div className="md:hidden px-2 mb-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab
              ? activeTab === item.id
              : currentPath === item.href ||
                (item.href !== "/" && currentPath?.startsWith(item.href));

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (isMobileMenuOpen) toggleMobileMenu();
                  if (setActiveTab) {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }
                }}
                title={isCollapsed ? item.label : ""}
                className={cn(
                  "w-full flex items-center py-3.5 transition-all duration-300 group relative cursor-pointer",
                  isCollapsed
                    ? "justify-center px-0 gap-0 rounded-2xl"
                    : "px-4 gap-4 rounded-2xl",
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100",
                )}
              >
                <Icon
                  size={22}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "group-hover:text-gray-900 dark:group-hover:text-zinc-100",
                  )}
                />
                <span
                  className={cn(
                    "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                    isCollapsed
                      ? "max-w-0 opacity-0 -translate-x-4"
                      : "max-w-[200px] opacity-100 translate-x-0",
                  )}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div
                    className={cn(
                      "absolute w-1.5 h-1.5 bg-white rounded-full shadow-sm",
                      isCollapsed ? "top-3 right-3" : "right-4",
                    )}
                  ></div>
                )}
              </a>
            );
          })}

          <div className="px-2 my-2">
            <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full" />
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isCollapsed
                ? "max-h-0 opacity-0 py-0"
                : "max-h-8 opacity-100 py-1",
            )}
          >
            <div className="text-xs font-bold text-gray-400 px-4 uppercase tracking-wider mb-2 whitespace-nowrap">
              System
            </div>
          </div>

          <div className="space-y-1">
            <a
              href="/recommendation"
              onClick={(e) => {
                if (isMobileMenuOpen) toggleMobileMenu();
                if (setActiveTab) {
                  e.preventDefault();
                  setActiveTab("recommendation");
                }
              }}
              title={isCollapsed ? "AI Recommendation" : ""}
              className={cn(
                "w-full flex items-center py-3.5 transition-all duration-300 group relative cursor-pointer",
                isCollapsed
                  ? "justify-center px-0 gap-0 rounded-2xl"
                  : "px-4 gap-4 rounded-2xl",
                (
                  activeTab
                    ? activeTab === "recommendation"
                    : currentPath === "/recommendation"
                )
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100",
              )}
            >
              <BrainCircuit
                size={22}
                className={cn(
                  "shrink-0 transition-colors",
                  (
                    activeTab
                      ? activeTab === "recommendation"
                      : currentPath === "/recommendation"
                  )
                    ? "text-white"
                    : "group-hover:text-gray-900 dark:group-hover:text-zinc-100",
                )}
              />
              <span
                className={cn(
                  "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isCollapsed
                    ? "max-w-0 opacity-0 -translate-x-4"
                    : "max-w-[200px] opacity-100 translate-x-0",
                )}
              >
                Recommendation
              </span>
            </a>

            <a
              href="/settings"
              onClick={(e) => {
                if (isMobileMenuOpen) toggleMobileMenu();
                if (setActiveTab) {
                  e.preventDefault();
                  setActiveTab("settings");
                }
              }}
              title={isCollapsed ? "Settings" : ""}
              className={cn(
                "w-full flex items-center py-3.5 transition-all duration-300 group relative cursor-pointer",
                isCollapsed
                  ? "justify-center px-0 gap-0 rounded-2xl"
                  : "px-4 gap-4 rounded-2xl",
                (
                  activeTab
                    ? activeTab === "settings"
                    : currentPath === "/settings"
                )
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100",
              )}
            >
              <Settings
                size={22}
                className={cn(
                  "shrink-0 transition-colors",
                  (
                    activeTab
                      ? activeTab === "settings"
                      : currentPath === "/settings"
                  )
                    ? "text-white"
                    : "group-hover:text-gray-900 dark:group-hover:text-zinc-100",
                )}
              />
              <span
                className={cn(
                  "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isCollapsed
                    ? "max-w-0 opacity-0 -translate-x-4"
                    : "max-w-[200px] opacity-100 translate-x-0",
                )}
              >
                Settings
              </span>
            </a>
          </div>
        </nav>

        {/* Footer Logout Button */}
        <div
          className={cn(
            "p-4 mt-auto border-t border-gray-100 dark:border-zinc-800 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4",
          )}
        >
          <button
            onClick={onLogout}
            title={isCollapsed ? "Log Out" : ""}
            className={cn(
              "w-full flex items-center py-3.5 transition-all duration-300 group relative cursor-pointer rounded-2xl",
              "hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400",
              isCollapsed ? "justify-center px-0" : "px-4 gap-4",
            )}
          >
            <LogOut size={22} className="shrink-0 transition-colors" />
            <span
              className={cn(
                "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                isCollapsed
                  ? "max-w-0 opacity-0 -translate-x-4"
                  : "max-w-[200px] opacity-100 translate-x-0",
              )}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
