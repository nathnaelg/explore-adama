"use client";

import {
  Activity,
  Calendar,
  ChevronRight,
  History,
  Loader2,
  MapPin,
  Ticket,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsApi, api } from "../services/api";
import { cn } from "../utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface DashboardHomeProps {
  isDarkMode: boolean;
  searchTerm?: string;
  onNavigate?: (path: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  isDarkMode,
  searchTerm = "",
  onNavigate,
}) => {
  const [stats, setStats] = useState<any>({});
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [weather, setWeather] = useState({
    temp: "--°C",
    rain: "--mm",
    aqi: "--",
  });

  const fetchEnvironmentalData = async () => {
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=8.5410&longitude=39.2688&current=temperature_2m,rain",
        ).catch(() => null),
        fetch(
          "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=8.5410&longitude=39.2688&current=european_aqi",
        ).catch(() => null),
      ]);

      if (weatherRes) {
        const wData = await weatherRes.json();
        setWeather((prev) => ({
          ...prev,
          temp: `${Math.round(wData?.current?.temperature_2m || 0)}°C`,
          rain: `${(wData?.current?.rain || 0).toFixed(1)}mm`,
        }));
      }

      if (aqiRes) {
        const aData = await aqiRes.json();
        setWeather((prev) => ({
          ...prev,
          aqi: (aData?.current?.european_aqi || "--").toString(),
        }));
      }
    } catch (e) {
      console.warn("Environmental pulse error", e);
    }
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, growthRes, bookingsRes] = await Promise.all([
          analyticsApi.getStats("month").catch(() => ({})),
          analyticsApi.getGrowthTrends("month").catch(() => []),
          api.get("/bookings?perPage=10").catch(() => []),
        ]);

        setStats(statsRes || {});
        setGrowthData(Array.isArray(growthRes) ? growthRes : []);
        setRecentBookings(extractData(bookingsRes));
        await fetchEnvironmentalData();
      } catch (error) {
        console.error("Dashboard calculation error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(fetchEnvironmentalData, 600000);
    return () => clearInterval(interval);
  }, [searchTerm]);

  if (loading && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Header HUD - Fixed Sticky with backdrop fix */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Activity className="text-blue-500" /> Dashboard Panel
          </h2>
          <p className="text-sm text-gray-500">Explore Adama Dashboard Panel</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-4 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-emerald-700 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-widest">
              System Active
            </p>
          </div>
          <EnvironmentalChip label="AQI" value={weather.aqi} color="emerald" />
          <EnvironmentalChip label="TEMP" value={weather.temp} color="orange" />
        </div>
      </div>

      {/* Professional KPI Ribbon - Growth moved to right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Places"
          value={stats?.places?.total || 0}
          change={2.4}
          isPositive={true}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Total Events"
          value={stats?.events?.total || 0}
          change={5.1}
          isPositive={true}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Total Tickets"
          value={stats?.events?.totalIssued || stats?.totalOrders || 0}
          change={stats?.orderGrowth || 8.4}
          isPositive={(stats?.orderGrowth || 0) >= 0}
          icon={Ticket}
          color="emerald"
        />
        <StatCard
          title="Total Users"
          value={stats?.users?.touristCount || 0}
          change={12.5}
          isPositive={true}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Maximized Analytical Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartContainer
            title="Bookings Growth"
            sub="Bookings flow over time"
            icon={Ticket}
            iconColor="text-emerald-500"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDarkMode ? "#1f1f23" : "#f3f4f6"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  content={<CustomTooltip isDarkMode={isDarkMode} />}
                  cursor={{
                    stroke: "#10b981",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  name="Bookings"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer
          title="Users Growth"
          sub="New Users registrations"
          icon={Users}
          iconColor="text-blue-500"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDarkMode ? "#1f1f23" : "#f3f4f6"}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
              <Bar
                name="New Users"
                dataKey="users"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="xl:col-span-3">
          <ChartContainer
            title="Event Activation Trace"
            sub="Registry deployment and life-cycle analytics"
            icon={Calendar}
            iconColor="text-purple-500"
            height="h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.events?.createdTrend || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDarkMode ? "#1f1f23" : "#f3f4f6"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                <Line
                  name="Events"
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#8b5cf6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Trace Log - System Table Aesthetic */}
      <Card className="rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-black flex items-center gap-2 uppercase tracking-tighter">
              <History className="text-orange-500" size={18} />
              Recent Bookings
            </CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Recent bookings activity
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("/tickets")}
            className="rounded-xl h-8 px-4 font-black text-[9px] uppercase tracking-widest gap-2 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
          >
            More <ChevronRight size={14} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-950 text-gray-400 font-black uppercase text-[9px] tracking-[0.2em]">
                  <th className="p-4 pl-8 border-b border-gray-100 dark:border-zinc-800">
                    Id
                  </th>
                  <th className="p-4 border-b border-gray-100 dark:border-zinc-800">
                    User
                  </th>
                  <th className="p-4 border-b border-gray-100 dark:border-zinc-800">
                    Event
                  </th>
                  <th className="p-4 text-center pr-8 border-b border-gray-100 dark:border-zinc-800">
                    Value (ETB)
                  </th>
                  <th className="p-4 text-left pr-8 border-b border-gray-100 dark:border-zinc-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 text-[12px]">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest opacity-30"
                    >
                      No recent bookings.
                    </td>
                  </tr>
                ) : (
                  recentBookings.slice(0, 5).map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <td className="p-4 pl-8 font-mono text-[10px] text-gray-400 font-black">
                        #{String(b.id).substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                            <User size={14} />
                          </div>
                          <span className="font-bold text-gray-800 dark:text-zinc-200 truncate">
                            {b.userId || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-600 dark:text-zinc-400 truncate max-w-[200px]">
                            {b.event?.title || "Platform Service"}
                          </span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                            <Zap size={8} fill="currentColor" />{" "}
                            {b.quantity || 1} CREDENTIALS
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-left pr-8">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-sm">
                            {(b.total || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-left pr-8">
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border mt-1",
                            ["CONFIRMED", "SUCCESS"].includes(b.status)
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800"
                              : "bg-yellow-50 border-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-800",
                          )}
                        >
                          {b.status || "PENDING"}
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
    </div>
  );
};

const ChartContainer = ({
  title,
  sub,
  icon: Icon,
  iconColor,
  height = "h-[380px]",
  children,
}: any) => (
  <Card className="rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 shadow-lg bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-500 hover:shadow-2xl">
    <CardHeader className="p-6 pb-2">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            {title}
          </CardTitle>
          <CardDescription className="text-base font-black text-gray-900 dark:text-white leading-tight">
            {sub}
          </CardDescription>
        </div>
        <div
          className={cn(
            "p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50",
            iconColor,
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </CardHeader>
    <CardContent className={cn(height, "p-6 pt-0")}>{children}</CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, isDarkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
          {payload[0].payload.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-lg font-black text-blue-600 dark:text-blue-400">
            {payload[0].value.toLocaleString()}
          </p>
          <span className="text-[8px] font-bold text-gray-400 uppercase">
            Entries
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const EnvironmentalChip = ({ label, value, color }: any) => {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    emerald:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800",
    orange:
      "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
  };
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-tighter shadow-sm",
        colorMap[color],
      )}
    >
      <span className="opacity-50 tracking-[0.1em]">{label}</span>
      <span className="text-[12px]">{value}</span>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color,
}: any) => {
  const colorStyles: any = {
    blue: "bg-blue-600 shadow-blue-500/20 text-white",
    purple: "bg-purple-600 shadow-purple-500/20 text-white",
    emerald: "bg-emerald-600 shadow-emerald-500/20 text-white",
    amber: "bg-amber-500 shadow-amber-500/20 text-white",
  };

  return (
    <Card className="rounded-[1.25rem] border border-gray-100 dark:border-zinc-800 shadow-lg group overflow-hidden bg-white dark:bg-zinc-900 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "p-3.5 rounded-2xl transition-transform group-hover:scale-110",
              colorStyles[color],
            )}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
              {title}
            </p>
            <h3 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white truncate">
              {(Number(value) || 0).toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Growth Badge on the right side */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm border",
            isPositive
              ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800"
              : "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800",
          )}
        >
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(change)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHome;
