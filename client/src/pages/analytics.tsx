import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KpiCard from "@/components/kpi-card";
import { formatCurrency, formatNumber } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(0, 72%, 51%)", "hsl(25, 90%, 48%)", "hsl(142, 60%, 40%)", "hsl(217, 70%, 50%)"];

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-analytics-title">Аналитик</h1>
        <p className="text-muted-foreground text-sm mt-1">Гүйцэтгэлийн тайлан ба шинжилгээ</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Нийт орлого"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+15% өмнөх сараас"
          changeType="positive"
          icon={TrendingUp}
          delay={0}
        />
        <KpiCard
          title="Идэвхтэй гишүүд"
          value={stats?.activeMembers?.toString() || "0"}
          change={`${stats?.totalMembers || 0} нийт`}
          changeType="neutral"
          icon={Users}
          delay={0.1}
        />
        <KpiCard
          title="Ирц (энэ сар)"
          value={stats?.monthlyAttendance?.toString() || "0"}
          change="Нийт бүртгэл"
          changeType="neutral"
          icon={Activity}
          delay={0.2}
        />
        <KpiCard
          title="Дундаж орлого/гишүүн"
          value={formatCurrency(stats?.avgRevenuePerMember || 0)}
          icon={Target}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Сарын орлогын чиг хандлага</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrend || []}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}М`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(0, 0%, 14%)",
                      borderRadius: "6px",
                      color: "hsl(0, 0%, 95%)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Орлого"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(0, 72%, 51%)" fill="url(#analyticsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Салбаруудын орлогын харьцуулалт</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.branchRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}М`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(0, 0%, 14%)",
                      borderRadius: "6px",
                      color: "hsl(0, 0%, 95%)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Орлого"]}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {(stats?.branchRevenue || []).map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Гишүүнчлэлийн статусын тойм</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.statusBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="status"
                  strokeWidth={2}
                  stroke="hsl(0, 0%, 8%)"
                >
                  {(stats?.statusBreakdown || []).map((_: any, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 8%)",
                    border: "1px solid hsl(0, 0%, 14%)",
                    borderRadius: "6px",
                    color: "hsl(0, 0%, 95%)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 min-w-32">
              {(stats?.statusBreakdown || []).map((item: any, idx: number) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm text-muted-foreground">{item.status} ({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
