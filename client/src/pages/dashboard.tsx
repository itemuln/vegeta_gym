import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Dumbbell, Building2, CreditCard, TrendingUp, Activity, UserCheck, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import KpiCard from "@/components/kpi-card";
import { formatCurrency, membershipStatusLabels } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from "recharts";

const COLORS = ["hsl(0, 72%, 51%)", "hsl(25, 90%, 48%)", "hsl(142, 60%, 40%)", "hsl(217, 70%, 50%)"];

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const membershipData = stats?.membershipBreakdown || [];
  const revenueData = stats?.monthlyRevenue || [];
  const branchData = stats?.branchStats || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">Хянах самбар</h1>
        <p className="text-muted-foreground text-sm mt-1">Vegete Gym-ийн ерөнхий мэдээлэл</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Нийт гишүүд"
          value={stats?.totalMembers?.toString() || "0"}
          change={`${stats?.activeMembers || 0} идэвхтэй`}
          changeType="positive"
          icon={Users}
          delay={0}
        />
        <KpiCard
          title="Дасгалжуулагч"
          value={stats?.totalTrainers?.toString() || "0"}
          change="Бүгд идэвхтэй"
          changeType="positive"
          icon={Dumbbell}
          delay={0.1}
        />
        <KpiCard
          title="Салбарууд"
          value={stats?.totalBranches?.toString() || "0"}
          change="Бүх салбарууд ажиллаж байна"
          changeType="positive"
          icon={Building2}
          delay={0.2}
        />
        <KpiCard
          title="Сарын орлого"
          value={formatCurrency(stats?.monthlyRevenue?.[stats.monthlyRevenue.length - 1]?.revenue || 0)}
          change="+12% өмнөх сараас"
          changeType="positive"
          icon={DollarSign}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4" data-testid="text-revenue-chart-title">Сарын орлого</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}М`} />
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
                  <Area type="monotone" dataKey="revenue" stroke="hsl(0, 72%, 51%)" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4" data-testid="text-membership-chart-title">Гишүүнчлэлийн төрөл</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="type"
                    strokeWidth={2}
                    stroke="hsl(0, 0%, 8%)"
                  >
                    {membershipData.map((_: any, idx: number) => (
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
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {membershipData.map((item: any, idx: number) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{item.type} ({item.count})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" data-testid="text-branch-stats-title">Салбаруудын мэдээлэл</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 8%)",
                    border: "1px solid hsl(0, 0%, 14%)",
                    borderRadius: "6px",
                    color: "hsl(0, 0%, 95%)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="members" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Гишүүд" />
                <Bar dataKey="trainers" fill="hsl(25, 90%, 48%)" radius={[4, 4, 0, 0]} name="Дасгалжуулагч" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Сүүлийн гишүүд</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-muted-foreground font-medium">Нэр</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Төрөл</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Статус</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Салбар</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentMembers?.map((m: any) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{m.lastName} {m.firstName}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="text-xs">
                        {m.membershipType === "basic" ? "Энгийн" : m.membershipType === "premium" ? "Премиум" : "Тамирчин"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={m.membershipStatus === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {membershipStatusLabels[m.membershipStatus]}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{m.branchName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
