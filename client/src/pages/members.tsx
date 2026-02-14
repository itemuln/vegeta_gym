import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserCheck, UserX, Clock, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, membershipTypeLabels, membershipStatusLabels } from "@/lib/data";
import type { Member, Branch } from "@shared/schema";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: members = [], isLoading } = useQuery<(Member & { branchName?: string })[]>({
    queryKey: ["/api/members"],
  });

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsAddOpen(false);
      toast({ title: "Гишүүн амжилттай нэмэгдлээ" });
    },
    onError: () => {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
    },
  });

  const filtered = members.filter((m) => {
    const matchSearch =
      `${m.firstName} ${m.lastName} ${m.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.membershipStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMutation.mutate({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      phone: fd.get("phone"),
      email: fd.get("email") || undefined,
      membershipType: fd.get("membershipType"),
      branchId: fd.get("branchId"),
      monthlyFee: fd.get("monthlyFee") || "150000",
    });
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "active": return <UserCheck className="w-3.5 h-3.5" />;
      case "suspended": return <Clock className="w-3.5 h-3.5" />;
      default: return <UserX className="w-3.5 h-3.5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-members-title">Гишүүд</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Нийт {members.length} гишүүн бүртгэлтэй
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-member">
              <Plus className="w-4 h-4 mr-2" />
              Гишүүн нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Шинэ гишүүн бүртгэх</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Овог</Label>
                  <Input name="lastName" required data-testid="input-member-lastname" />
                </div>
                <div className="space-y-2">
                  <Label>Нэр</Label>
                  <Input name="firstName" required data-testid="input-member-firstname" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Утас</Label>
                <Input name="phone" required data-testid="input-member-phone" />
              </div>
              <div className="space-y-2">
                <Label>Имэйл</Label>
                <Input name="email" type="email" data-testid="input-member-email" />
              </div>
              <div className="space-y-2">
                <Label>Гишүүнчлэлийн төрөл</Label>
                <select name="membershipType" className="w-full h-9 rounded-md border bg-background px-3 text-sm" defaultValue="basic" data-testid="select-membership-type">
                  <option value="basic">Энгийн - 150,000₮</option>
                  <option value="premium">Премиум - 250,000₮</option>
                  <option value="athlete">Тамирчин - 400,000₮</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Салбар</Label>
                <select name="branchId" className="w-full h-9 rounded-md border bg-background px-3 text-sm" required data-testid="select-branch">
                  <option value="">Сонгох...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Сарын төлбөр</Label>
                <Input name="monthlyFee" type="number" defaultValue="150000" data-testid="input-monthly-fee" />
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-member">
                {addMutation.isPending ? "Нэмж байна..." : "Бүртгэх"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Нэр, утасны дугаараар хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-members"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44" data-testid="select-status-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            <SelectItem value="active">Идэвхтэй</SelectItem>
            <SelectItem value="suspended">Түр зогсоосон</SelectItem>
            <SelectItem value="expired">Хугацаа дууссан</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-muted-foreground font-medium">Нэр</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Утас</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Төрөл</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Статус</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Төлбөр</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden lg:table-cell">Салбар</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b last:border-0 hover-elevate"
                    data-testid={`row-member-${m.id}`}
                  >
                    <td className="p-4">
                      <div className="font-medium">{m.lastName} {m.firstName}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{m.phone}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground">{m.phone}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {membershipTypeLabels[m.membershipType]}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={m.membershipStatus === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {statusIcon(m.membershipStatus)}
                        <span className="ml-1">{membershipStatusLabels[m.membershipStatus]}</span>
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">
                      {formatCurrency(m.monthlyFee)}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">
                      {(m as any).branchName || "-"}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground" data-testid="text-no-members">
              Гишүүн олдсонгүй
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
