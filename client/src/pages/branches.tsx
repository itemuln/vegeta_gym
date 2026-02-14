import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, MapPin, Phone, Users, Dumbbell } from "lucide-react";
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
import type { Branch } from "@shared/schema";

export default function BranchesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: branches = [], isLoading } = useQuery<(Branch & { memberCount?: number; trainerCount?: number; revenue?: number })[]>({
    queryKey: ["/api/branches"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/branches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsAddOpen(false);
      toast({ title: "Салбар амжилттай нэмэгдлээ" });
    },
    onError: () => {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
    },
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMutation.mutate({
      name: fd.get("name"),
      address: fd.get("address"),
      phone: fd.get("phone"),
      city: fd.get("city") || "Улаанбаатар",
      country: fd.get("country") || "Монгол",
      operatingCost: fd.get("operatingCost") || "5000000",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64" />)}
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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-branches-title">Салбарууд</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Нийт {branches.length} салбар
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-branch">
              <Plus className="w-4 h-4 mr-2" />
              Салбар нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Шинэ салбар нэмэх</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Нэр</Label>
                <Input name="name" required data-testid="input-branch-name" />
              </div>
              <div className="space-y-2">
                <Label>Хаяг</Label>
                <Input name="address" required data-testid="input-branch-address" />
              </div>
              <div className="space-y-2">
                <Label>Утас</Label>
                <Input name="phone" required data-testid="input-branch-phone" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Хот</Label>
                  <Input name="city" defaultValue="Улаанбаатар" data-testid="input-branch-city" />
                </div>
                <div className="space-y-2">
                  <Label>Улс</Label>
                  <Input name="country" defaultValue="Монгол" data-testid="input-branch-country" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Үйл ажиллагааны зардал (сар)</Label>
                <Input name="operatingCost" type="number" defaultValue="5000000" data-testid="input-branch-cost" />
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-branch">
                {addMutation.isPending ? "Нэмж байна..." : "Нэмэх"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 hover-elevate" data-testid={`card-branch-${b.id}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  <Badge variant={b.isActive ? "default" : "secondary"} className="text-xs shrink-0">
                    {b.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{b.phone}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      {(b as any).memberCount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Гишүүд</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                      <Dumbbell className="w-3.5 h-3.5 text-primary" />
                      {(b as any).trainerCount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Дасгалжуулагч</p>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">
                      {formatCurrency((b as any).revenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Орлого</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Салбар бүртгэгдээгүй байна
        </div>
      )}
    </div>
  );
}
