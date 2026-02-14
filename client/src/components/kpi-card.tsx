import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export default function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground" data-testid={`kpi-label-${title}`}>{title}</p>
            <p className="text-2xl font-bold tracking-tight" data-testid={`kpi-value-${title}`}>{value}</p>
            {change && (
              <p
                className={`text-xs font-medium ${
                  changeType === "positive"
                    ? "text-green-500"
                    : changeType === "negative"
                      ? "text-red-400"
                      : "text-muted-foreground"
                }`}
                data-testid={`kpi-change-${title}`}
              >
                {change}
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
