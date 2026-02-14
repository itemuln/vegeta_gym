import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/data";
import type { Trainer, Branch } from "@shared/schema";

export default function TrainersPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: trainers = [], isLoading } = useQuery<(Trainer & { branchName?: string; memberCount?: number })[]>({
    queryKey: ["/api/trainers"],
  });

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/trainers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsAddOpen(false);
      toast({ title: "Дасгалжуулагч амжилттай нэмэгдлээ" });
    },
    onError: () => {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
    },
  });

  const filtered = trainers.filter((t) =>
    `${t.firstName} ${t.lastName} ${t.specialty}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMutation.mutate({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      phone: fd.get("phone"),
      email: fd.get("email") || undefined,
      certification: fd.get("certification"),
      specialty: fd.get("specialty"),
      branchId: fd.get("branchId"),
      salary: fd.get("salary") || "1500000",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-trainers-title">Дасгалжуулагчид</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Нийт {trainers.length} дасгалжуулагч
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-trainer">
              <Plus className="w-4 h-4 mr-2" />
              Дасгалжуулагч нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Шинэ дасгалжуулагч</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Овог</Label>
                  <Input name="lastName" required data-testid="input-trainer-lastname" />
                </div>
                <div className="space-y-2">
                  <Label>Нэр</Label>
                  <Input name="firstName" required data-testid="input-trainer-firstname" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Утас</Label>
                <Input name="phone" required data-testid="input-trainer-phone" />
              </div>
              <div className="space-y-2">
                <Label>Имэйл</Label>
                <Input name="email" type="email" data-testid="input-trainer-email" />
              </div>
              <div className="space-y-2">
                <Label>Мэргэжлийн гэрчилгээ</Label>
                <Input name="certification" required placeholder="NASM, ACE" data-testid="input-trainer-cert" />
              </div>
              <div className="space-y-2">
                <Label>Мэргэшил</Label>
                <Input name="specialty" required placeholder="Хүч чадал, Кардио" data-testid="input-trainer-specialty" />
              </div>
              <div className="space-y-2">
                <Label>Салбар</Label>
                <select name="branchId" className="w-full h-9 rounded-md border bg-background px-3 text-sm" required data-testid="select-trainer-branch">
                  <option value="">Сонгох...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Цалин</Label>
                <Input name="salary" type="number" defaultValue="1500000" data-testid="input-trainer-salary" />
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-trainer">
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
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Нэр, мэргэшлээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-trainers"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5 hover-elevate" data-testid={`card-trainer-${t.id}`}>
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {t.firstName.charAt(0)}{t.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold truncate">{t.lastName} {t.firstName}</h3>
                  <p className="text-sm text-muted-foreground truncate">{t.specialty}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground truncate">{t.certification}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{(t as any).memberCount || 0} гишүүн хариуцсан</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">{(t as any).branchName || "-"}</span>
                  <Badge variant="secondary" className="text-xs">{formatCurrency(t.salary)}</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-no-trainers">
          Дасгалжуулагч олдсонгүй
        </div>
      )}
    </div>
  );
}
