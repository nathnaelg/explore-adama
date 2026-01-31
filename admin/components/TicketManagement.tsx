"use client";

import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    Database,
    History,
    Loader2,
    QrCode,
    RefreshCw,
    Terminal,
    Ticket as TicketIcon,
    User,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { bookingsApi } from "../services/bookings/bookings.api";
import { ticketsApi } from "../services/tickets/tickets.api";
import { cn } from "../utils";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import ValidationConsole from "./ValidationConsole";

interface TicketManagementProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

const TicketManagement: React.FC<TicketManagementProps> = ({
  isDarkMode,
  searchTerm = "",
}) => {
  const [activeTab, setActiveTab] = useState<"tickets" | "bookings">("tickets");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "delete";
    message: string;
  } | null>(null);

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [ticketPage, setTicketPage] = useState(1);
  const [hasMoreTickets, setHasMoreTickets] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingPage, setBookingPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const perPage = 10;

  const showFeedback = (
    type: "success" | "error" | "delete",
    message: string,
  ) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showFeedback("success", "Token copied to clipboard.");
  };

  const extractData = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    const body = res.data || res;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    if (body && Array.isArray(body.items)) return body.items;
    return [];
  };

  const fetchTickets = useCallback(
    async (isSync = false) => {
      setIsLoadingTickets(true);
      try {
        const res = await ticketsApi.getAll({
          page: ticketPage,
          perPage,
          search: searchTerm,
        });

        const ticketList = extractData(res);
        const serverTotal = (res as any).total || (res as any).count || 0;

        setTickets(ticketList);
        setTotalTickets(serverTotal || ticketList.length);
        setHasMoreTickets(
          serverTotal > 0
            ? ticketPage * perPage < serverTotal
            : ticketList.length === perPage,
        );

        if (isSync) showFeedback("success", "Ticket registry synchronized.");
      } catch (e) {
        console.error("Ticket Fetch Error", e);
        setTickets([]);
      } finally {
        setIsLoadingTickets(false);
      }
    },
    [ticketPage, searchTerm],
  );

  const fetchBookings = useCallback(
    async (isSync = false) => {
      setIsLoadingBookings(true);
      try {
        const res = await bookingsApi.getAll({
          page: 1,
          perPage: 100,
          search: searchTerm,
        });

        const bookingList = extractData(res);
        const serverTotal = (res as any).total || (res as any).count || 0;

        setBookings(bookingList);
        setTotalBookings(serverTotal || bookingList.length);
        if (isSync) showFeedback("success", "Booking ledger synchronized.");
      } catch (e) {
        console.error("Booking Fetch Error", e);
        setBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  const displayedBookings = bookings.slice(
    (bookingPage - 1) * perPage,
    bookingPage * perPage,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Terminal className="text-blue-500" />
            Tickets Management
          </h2>
          <p className="text-sm text-gray-500">
            View and validate tickets and bookings
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1.5 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <button
            onClick={() => setActiveTab("tickets")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === "tickets"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800",
            )}
          >
            <TicketIcon size={14} /> Tickets
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === "bookings"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800",
            )}
          >
            <History size={14} /> Bookings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Console */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-8 self-start">
          <ValidationConsole
            isDarkMode={isDarkMode}
            onValidated={fetchTickets}
            totalCount={totalTickets}
            countLabel="Total Tickets"
          />
        </div>

        {/* Right Column: Dynamic Registry */}
        <div className="xl:col-span-8 flex flex-col h-full min-h-[600px]">
          <Card className="rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden flex flex-col flex-1">
            <CardHeader className="border-b border-gray-50 dark:border-zinc-800 flex flex-row items-center justify-between p-6 shrink-0 bg-gray-50/30 dark:bg-zinc-950/30">
              <div>
                <CardTitle className="flex items-center gap-2 font-black text-xl uppercase tracking-tighter">
                  {activeTab === "tickets" ? (
                    <>
                      <Database className="text-orange-500" size={24} /> Ticket
                      List
                    </>
                  ) : (
                    <>
                      <History className="text-blue-500" size={24} /> Booking
                      List
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {activeTab === "tickets"
                    ? "Ledger of all issued credentials"
                    : "Complete transaction history of platform orders"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  activeTab === "tickets"
                    ? fetchTickets(true)
                    : fetchBookings(true)
                }
                disabled={isLoadingTickets || isLoadingBookings}
                className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
              >
                {isLoadingTickets || isLoadingBookings ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}{" "}
                Refresh
              </Button>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto flex-1 relative min-h-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-zinc-950 shadow-sm">
                    <tr className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                      <th className="p-6 pl-10 border-b border-gray-100 dark:border-zinc-800">
                        Id
                      </th>
                      <th className="p-6 border-b border-gray-100 dark:border-zinc-800">
                        {activeTab === "tickets" ? "Token" : "Customer"}
                      </th>
                      <th className="p-6 border-b border-gray-100 dark:border-zinc-800">
                        Event
                      </th>
                      <th className="p-6 text-right pr-10 border-b border-gray-100 dark:border-zinc-800">
                        {activeTab === "tickets" ? "Status" : "Total Value"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                    {(
                      activeTab === "tickets"
                        ? isLoadingTickets
                        : isLoadingBookings
                    ) ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-24 text-center"
                          data-testid="loader"
                        >
                          <Loader2 className="animate-spin mx-auto text-blue-500 w-12 h-12" />
                        </td>
                      </tr>
                    ) : (activeTab === "tickets" ? tickets : displayedBookings)
                        .length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-24 text-center text-gray-400 font-black uppercase tracking-widest opacity-20"
                        >
                          No data found.
                        </td>
                      </tr>
                    ) : (
                      (activeTab === "tickets"
                        ? tickets
                        : displayedBookings
                      ).map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group"
                        >
                          <td className="p-6 pl-10 font-mono text-gray-400 font-black">
                            #{activeTab === "tickets" ? "TKT" : "ORD"}_
                            {String(item.id).substring(0, 8)}
                          </td>
                          <td className="p-6 font-black text-gray-700 dark:text-zinc-200">
                            {activeTab === "tickets" ? (
                              <div
                                className="flex items-center gap-2 group/id cursor-pointer"
                                onClick={() => copyToClipboard(item.qrToken)}
                                title="Click to copy full token"
                              >
                                <QrCode
                                  size={14}
                                  className="text-gray-300 group-hover/id:text-blue-500 transition-colors"
                                />
                                <span className="font-mono truncate max-w-[120px]">
                                  {item.qrToken?.substring(0, 12) || "---"}...
                                </span>
                                <Copy
                                  size={12}
                                  className="opacity-0 group-hover/id:opacity-100 text-gray-400 ml-1"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 truncate max-w-[150px]">
                                <User
                                  size={14}
                                  className="text-gray-400 shrink-0"
                                />
                                <span className="truncate">
                                  {item.user?.profile?.name ||
                                    item.user?.email ||
                                    "Guest Node"}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 dark:text-zinc-300 truncate max-w-[200px]">
                                {item.event?.title || "System Resource"}
                              </span>
                              <span className="text-[9px] font-mono text-gray-400 uppercase">
                                {activeTab === "tickets"
                                  ? `UID: ${item.eventId || "---"}`
                                  : `Qty: ${item.quantity || item.ticketCount || 1}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-right pr-10">
                            {activeTab === "tickets" ? (
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full font-black uppercase text-[9px] tracking-wider",
                                  ["CONFIRMED", "VALID", "SUCCESS"].includes(
                                    item.status,
                                  )
                                    ? "bg-emerald-100 text-emerald-700"
                                    : item.status === "USED"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-red-100 text-red-700",
                                )}
                              >
                                {item.status || "PENDING"}
                              </span>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="font-black text-sm">
                                  ETB {(item.total || 0).toLocaleString()}
                                </span>
                                <span
                                  className={cn(
                                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                                    ["CONFIRMED", "SUCCESS", "PAID"].includes(
                                      item.status,
                                    )
                                      ? "bg-green-50 text-green-600"
                                      : "bg-yellow-50 text-yellow-600",
                                  )}
                                >
                                  {item.status}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>

            {(activeTab === "tickets"
              ? !isLoadingTickets
              : !isLoadingBookings) && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    activeTab === "tickets"
                      ? setTicketPage((prev) => Math.max(1, prev - 1))
                      : setBookingPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={
                    (activeTab === "tickets"
                      ? ticketPage === 1
                      : bookingPage === 1) ||
                    (activeTab === "tickets"
                      ? isLoadingTickets
                      : isLoadingBookings)
                  }
                  className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Page {activeTab === "tickets" ? ticketPage : bookingPage} of{" "}
                  {Math.ceil(
                    (activeTab === "tickets" ? totalTickets : totalBookings) /
                      perPage,
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    activeTab === "tickets"
                      ? setTicketPage((prev) => prev + 1)
                      : setBookingPage((prev) => prev + 1)
                  }
                  disabled={
                    !(activeTab === "tickets"
                      ? hasMoreTickets && !isLoadingTickets
                      : bookingPage * perPage < bookings.length)
                  }
                  className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

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

export default TicketManagement;
