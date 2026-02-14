import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search, CreditCard, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/data";
import KpiCard from "@/components/kpi-card";
import type { Payment, Member, Branch } from "@shared/schema";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: payments = [], isLoading } = useQuery<(Payment & { memberName?: string; branchName?: string })[]>({
    queryKey: ["/api/payments"],
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/payments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsAddOpen(false);
      toast({ title: "Төлбөр амжилттай бүртгэгдлээ" });
    },
    onError: () => {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
    },
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const member = members.find(m => m.id === fd.get("memberId"));
    addMutation.mutate({
      memberId: fd.get("memberId"),
      amount: fd.get("amount"),
      month: fd.get("month"),
      year: parseInt(fd.get("year") as string),
      branchId: member?.branchId || branches[0]?.id,
    });
  };

  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount as string), 0);
  const thisMonth = payments.filter(p => {
    const now = new Date();
    return p.month === (now.getMonth() + 1).toString() && p.year === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((s, p) => s + parseFloat(p.amount as string), 0);

  const filtered = payments.filter((p) =>
    ((p as any).memberName || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-payments-title">Төлбөрүүд</h1>
          <p className="text-muted-foreground text-sm mt-1">Төлбөрийн бүртгэл, түүх</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-payment">
              <Plus className="w-4 h-4 mr-2" />
              Төлбөр бүртгэх
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Төлбөр бүртгэх</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Гишүүн</Label>
                <select name="memberId" className="w-full h-9 rounded-md border bg-background px-3 text-sm" required data-testid="select-payment-member">
                  <option value="">Сонгох...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.lastName} {m.firstName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Дүн</Label>
                <Input name="amount" type="number" defaultValue="150000" required data-testid="input-payment-amount" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Сар</Label>
                  <select name="month" className="w-full h-9 rounded-md border bg-background px-3 text-sm" defaultValue={(new Date().getMonth() + 1).toString()} data-testid="select-payment-month">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>{i + 1}-р сар</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Жил</Label>
                  <Input name="year" type="number" defaultValue={new Date().getFullYear()} required data-testid="input-payment-year" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-payment">
                {addMutation.isPending ? "Бүртгэж байна..." : "Бүртгэх"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Нийт орлого" value={formatCurrency(totalPaid)} icon={CreditCard} delay={0} />
        <KpiCard title="Энэ сарын орлого" value={formatCurrency(thisMonthTotal)} icon={Calendar} delay={0.1} />
        <KpiCard title="Нийт төлбөр" value={payments.length.toString()} icon={CreditCard} delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Гишүүний нэрээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-payments"
          />
        </div>
      </motion.div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-muted-foreground font-medium">Гишүүн</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Дүн</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Сар/Жил</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Салбар</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b last:border-0"
                  data-testid={`row-payment-${p.id}`}
                >
                  <td className="p-4 font-medium">{(p as any).memberName || "-"}</td>
                  <td className="p-4 font-medium text-primary">{formatCurrency(p.amount)}</td>
                  <td className="p-4 hidden sm:table-cell text-muted-foreground">{p.month}-р сар / {p.year}</td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{(p as any).branchName || "-"}</td>
                  <td className="p-4">
                    <Badge variant="default" className="text-xs">Төлсөн</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Төлбөр олдсонгүй
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
