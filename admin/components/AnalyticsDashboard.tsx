"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Ban,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  Clock,
  Download,
  History,
  Loader2,
  ShieldCheck,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsApi } from "../services/analytics/analytics.api";
import { cn } from "../utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Select } from "./ui/select";

const AnalyticsDashboard: React.FC<{ isDarkMode: boolean }> = ({
  isDarkMode,
}) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, growthRes] = await Promise.all([
        analyticsApi.getStats(timeRange),
        analyticsApi.getGrowthTrends(timeRange),
      ]);
      setStats(statsRes);
      setGrowthData(Array.isArray(growthRes) ? growthRes : []);
    } catch (err) {
      console.error("Analytics Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    if (!stats) return;
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "EXPLORE ADAMA - COMPREHENSIVE SYSTEM ANALYTICS REPORT\n";
      csvContent += `Report Period,${timeRange === "week" ? "Past 7 Days" : timeRange === "month" ? "Past 30 Days" : "Past Year"}\n`;
      csvContent += `Generated At,${new Date().toLocaleString()}\n\n`;

      csvContent += "--- FINANCIAL & TICKET ANALYTICS ---\n";
      csvContent += `Total Ticket Revenue,ETB ${(stats.totalRevenue || 0).toLocaleString()}\n`;
      csvContent += `Total Capacity (System-wide),${(stats.events?.totalCapacity || 0).toLocaleString()}\n`;
      csvContent += `Total Tickets Issued,${(stats.events?.totalIssued || 0).toLocaleString()}\n`;
      csvContent += `Capacity Occupancy Rate,${stats.events?.occupancyRate || 0}%\n\n`;

      csvContent += "--- PLATFORM REGISTRY & MODERATION ---\n";
      csvContent += `Total Registered Users,${(stats.users?.total || 0).toLocaleString()}\n`;
      csvContent += `System Administrators,${(stats.users?.adminCount || 0).toLocaleString()}\n`;
      csvContent += `Banned/Suspended Users,${(stats.users?.banned || 0).toLocaleString()}\n\n`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `adama_analytics_${timeRange}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showFeedback("success", "Report exported successfully.");
    } catch (e) {
      showFeedback("error", "Export failed.");
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  const capacityChartData = [
    {
      name: "Tickets Issued",
      value: stats.events?.totalIssued || 0,
      color: "#3b82f6",
    },
    {
      name: "Remaining Capacity",
      value: Math.max(
        0,
        (stats.events?.totalCapacity || 0) - (stats.events?.totalIssued || 0),
      ),
      color: "#e5e7eb",
    },
  ];

  // Process activation data for the Bar Chart
  const activationChartData = (stats.events?.recentActivations || [])
    .map((e: any) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      // Calculate duration in hours
      const durationHours = Math.max(
        1,
        Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)),
      );

      return {
        name: e.title,
        duration: durationHours,
        start: start.toLocaleString(),
        end: end.toLocaleString(),
        category: e.category,
        status: e.status,
      };
    })
    .reverse(); // Reverse to show newest at top if using horizontal layout

  const CustomActivationTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
            {data.category}
          </p>
          <p className="text-sm font-black mb-3">{data.name}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-400 font-bold uppercase">Start:</span>
              <span className="font-black">{data.start}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-gray-400 font-bold uppercase">End:</span>
              <span className="font-black">{data.end}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-400">
                Duration :
              </span>
              <span className="text-xs font-black text-purple-500">
                {data.duration} Hours
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* System Intelligence Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            Data Analytics
          </h2>
          <p className="text-sm text-gray-500">
            Platform Monitoring & Growth Analysis
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full md:w-[150px] font-bold text-[10px] uppercase tracking-wider rounded-xl"
          >
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
            <option value="year">Past Year</option>
          </Select>
          <Button
            onClick={handleExport}
            className="gap-2 shrink-0 w-full md:w-auto rounded-xl font-black shadow-lg shadow-blue-500/20 text-[10px] uppercase tracking-widest"
          >
            <Download size={16} /> Export Report
          </Button>
        </div>
      </div>

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricTile
          title="Total Earnings"
          value={`ETB ${(stats.totalRevenue || 0).toLocaleString()}`}
          sub="Total Earnings From Ticket Sales"
          icon={CircleDollarSign}
          color="green"
        />
        <MetricTile
          title="Total Admins"
          value={stats.users?.adminCount || 0}
          sub="Total System Admins"
          icon={ShieldCheck}
          color="blue"
        />
        <MetricTile
          title="Total Users"
          value={stats.users?.total || 0}
          sub="Total Registered Accounts"
          icon={Users}
          color="purple"
        />
        <MetricTile
          title="Total Events"
          value={stats.events?.total || 0}
          sub="Total Registered Events"
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Analytic Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-widest text-gray-400">
                  Capacity Matrix
                </CardTitle>
                <CardDescription>
                  Utilization of seatings across all live events
                </CardDescription>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <Ticket className="text-blue-500" size={24} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capacityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {capacityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black">
                    {stats.events?.occupancyRate}%
                  </span>
                  <span className="text-[10px] uppercase font-black text-gray-400">
                    Utilized
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-5 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                    Tickets Issued
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                    {(stats.events?.totalIssued || 0).toLocaleString()}
                  </h4>
                  <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${stats.events?.occupancyRate}%` }}
                    />
                  </div>
                </div>
                <div className="p-5 rounded-[2rem] bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Total System Capacity
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                    {(stats.events?.totalCapacity || 0).toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black uppercase tracking-widest text-gray-400">
              Platform Trajectory
            </CardTitle>
            <CardDescription>
              Growth of registrations vs ticket activations
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDarkMode ? "#27272a" : "#f0f0f0"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Area
                  name="Registrations"
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={4}
                />
                <Area
                  name="Bookings"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Event Activation Graph */}
      <Card className="rounded-[2.5rem] border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-gray-50 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Zap className="text-purple-500" size={24} />
                Events Duration Time
              </CardTitle>
              <CardDescription>
                Visualizing event deployment windows and termination schedules
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <Clock size={16} className="text-purple-500" />
              <span className="text-[10px] font-black uppercase text-gray-400">
                Total Duration Time
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={activationChartData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="activationGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke={isDarkMode ? "#27272a" : "#f0f0f0"}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: "bold" }}
                    label={{
                      value: "Hours Active",
                      position: "insideBottomRight",
                      offset: -5,
                      fontSize: 10,
                      fontWeight: "black",
                      textAnchor: "middle",
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: "bold", width: 100 }}
                    width={120}
                  />
                  <Tooltip
                    content={<CustomActivationTooltip />}
                    cursor={{ fill: isDarkMode ? "#27272a" : "#f8fafc" }}
                  />
                  <Bar
                    dataKey="duration"
                    fill="url(#activationGradient)"
                    radius={[0, 10, 10, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Activation Insights
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      Avg. Duration Time
                    </p>
                    <p className="text-xl font-black">
                      {activationChartData.length > 0
                        ? Math.round(
                            activationChartData.reduce(
                              (acc, cur) => acc + cur.duration,
                              0,
                            ) / activationChartData.length,
                          )
                        : 0}{" "}
                      Hours
                    </p>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      Longest Duration Time
                    </p>
                    <p className="text-xl font-black text-purple-500">
                      {activationChartData.length > 0
                        ? Math.max(
                            ...activationChartData.map((d) => d.duration),
                          )
                        : 0}{" "}
                      Hours
                    </p>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      Active Events
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xl font-black">
                        {
                          activationChartData.filter(
                            (d) =>
                              d.status === "ONGOING" || d.status === "UPCOMING",
                          ).length
                        }{" "}
                        Events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Audit Table */}
      <Card className="rounded-[2.5rem] border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-gray-50 dark:border-zinc-800">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <History className="text-orange-500" size={24} /> System Audit:
            Issued Credentials
          </CardTitle>
          <CardDescription>
            Real-time transaction log of participant ticket activations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-6 pl-8">Order ID</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Entity</th>
                  <th className="p-6">Value</th>
                  <th className="p-6 text-right pr-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                {!stats.traffic?.recentTickets ||
                stats.traffic.recentTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-gray-400 font-bold"
                    >
                      No active ticket transactions detected.
                    </td>
                  </tr>
                ) : (
                  stats.traffic.recentTickets.map((t: any) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-6 pl-8 font-mono text-gray-400">
                        #ORD_{String(t.id).substring(0, 8)}
                      </td>
                      <td className="p-6 font-bold text-gray-700 dark:text-zinc-200">
                        {t.customer}
                      </td>
                      <td className="p-6 font-medium text-gray-500">
                        {t.eventName}
                      </td>
                      <td className="p-6 font-black text-gray-900 dark:text-white">
                        ETB {t.amount.toLocaleString()}
                      </td>
                      <td className="p-6 text-right pr-8">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                            ["CONFIRMED", "SUCCESS", "PUBLISHED"].includes(
                              t.status,
                            )
                              ? "bg-green-100 text-green-700"
                              : t.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700",
                          )}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security & Moderation Flow */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
          <ShieldCheck size={32} className="text-blue-500" />
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Security & Moderation
            </h2>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
              Platform Integrity Audit
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModerationCard
            label="Banned Users"
            value={stats.users?.banned || 0}
            icon={Ban}
            color="red"
          />
          <ModerationCard
            label="Total Tourists"
            value={stats.users?.touristCount || 0}
            icon={Users}
            color="blue"
          />
          <ModerationCard
            label="Acquisition Flow"
            value={`+${stats.users?.newCount || 0}`}
            icon={TrendingUp}
            color="green"
          />
        </div>
      </section>

      {feedback && (
        <div
          className={cn(
            "fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in z-[9999] text-white",
            feedback.type === "error" ? "bg-red-600" : "bg-green-600",
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

const ModerationCard = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    red: "bg-red-50 text-red-600 dark:bg-red-900/10",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/10",
    green: "bg-green-50 text-green-600 dark:bg-green-900/10",
  };
  return (
    <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-all">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <h3 className="text-4xl font-black">{value}</h3>
      </div>
      <div
        className={cn(
          "p-4 rounded-3xl transition-transform group-hover:scale-110",
          colors[color],
        )}
      >
        <Icon size={32} />
      </div>
    </div>
  );
};

const MetricTile = ({ title, value, sub, icon: Icon, color }: any) => {
  const colors: any = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-500 bg-green-50 dark:bg-blue-900/20",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-2xl transition-transform group-hover:scale-110",
            colors[color],
          )}
        >
          <Icon size={24} />
        </div>
        <ArrowUpRight
          size={14}
          className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <h3 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white truncate">
        {value}
      </h3>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mt-2">
        {title}
      </p>
      <p className="text-[10px] text-gray-400 opacity-60 mt-1 font-medium italic">
        {sub}
      </p>
    </div>
  );
};

export default AnalyticsDashboard;
