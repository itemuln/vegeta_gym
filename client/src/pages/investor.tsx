import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, PiggyBank, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KpiCard from "@/components/kpi-card";
import { formatCurrency, formatNumber } from "@/lib/data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";

const COLORS = ["hsl(0, 72%, 51%)", "hsl(25, 90%, 48%)", "hsl(142, 60%, 40%)", "hsl(217, 70%, 50%)"];

export default function InvestorPage() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/investor"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const roi = stats?.annualProfit && stats?.initialInvestment
    ? ((stats.annualProfit / stats.initialInvestment) * 100).toFixed(1)
    : "0";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-investor-title">Хөрөнгө оруулагчийн самбар</h1>
        <p className="text-muted-foreground text-sm mt-1">Санхүүгийн тайлан ба ROI шинжилгээ</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Жилийн нийт орлого"
          value={formatCurrency(stats?.annualRevenue || 0)}
          change="+18% өмнөх жилээс"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <KpiCard
          title="Үйл ажиллагааны зардал"
          value={formatCurrency(stats?.operatingCost || 0)}
          change="Сарын нийт зардал"
          changeType="neutral"
          icon={PiggyBank}
          delay={0.1}
        />
        <KpiCard
          title="Жилийн ашиг"
          value={formatCurrency(stats?.annualProfit || 0)}
          change={`${parseFloat(roi) > 0 ? "+" : ""}${roi}% ROI`}
          changeType={parseFloat(roi) > 0 ? "positive" : "negative"}
          icon={TrendingUp}
          delay={0.2}
        />
        <KpiCard
          title="ROI"
          value={`${roi}%`}
          change="(Жилийн ашиг / Хөрөнгө) × 100"
          changeType={parseFloat(roi) > 0 ? "positive" : "negative"}
          icon={BarChart3}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Орлого vs Зардал (Сараар)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyPnL || []}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 60%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 60%, 40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}М`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(0, 0%, 14%)",
                      borderRadius: "6px",
                      color: "hsl(0, 0%, 95%)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "revenue" ? "Орлого" : "Зардал",
                    ]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(142, 60%, 40%)" fill="url(#revGrad)" strokeWidth={2} name="revenue" />
                  <Area type="monotone" dataKey="cost" stroke="hsl(0, 72%, 51%)" fill="url(#costGrad)" strokeWidth={2} name="cost" />
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
          <Card className="p-5 h-full">
            <h3 className="text-sm font-semibold mb-4">Санхүүгийн тойм</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-muted">
                <p className="text-xs text-muted-foreground">Сарын орлого</p>
                <p className="text-lg font-bold mt-1">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">= Гишүүнчлэлийн хураамж × Идэвхтэй гишүүд</p>
              </div>
              <div className="p-3 rounded-md bg-muted">
                <p className="text-xs text-muted-foreground">Жилийн орлого</p>
                <p className="text-lg font-bold mt-1">{formatCurrency(stats?.annualRevenue || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">= Сарын орлого × 12</p>
              </div>
              <div className="p-3 rounded-md bg-muted">
                <p className="text-xs text-muted-foreground">ROI томъёо</p>
                <p className="text-lg font-bold mt-1 text-primary">{roi}%</p>
                <p className="text-xs text-muted-foreground mt-1">= (Жилийн ашиг / Анхны хөрөнгө) × 100</p>
              </div>
              <div className="p-3 rounded-md bg-muted">
                <p className="text-xs text-muted-foreground">Анхны хөрөнгө оруулалт</p>
                <p className="text-lg font-bold mt-1">{formatCurrency(stats?.initialInvestment || 0)}</p>
              </div>
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
          <h3 className="text-sm font-semibold mb-4">Салбаруудын ашигт ажиллагаа</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.branchProfitability || []}>
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
                  formatter={(value: number) => [formatCurrency(value), "Ашиг"]}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {(stats?.branchProfitability || []).map((_: any, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
