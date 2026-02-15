import { useQuery } from "@tanstack/react-query";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const specialtyColors: Record<string, string> = {
  "CrossFit": "hsl(0 72% 51%)",
  "Хүч чадал": "hsl(25 90% 48%)",
  "Йог": "hsl(280 55% 50%)",
  "Уян хатан": "hsl(280 55% 50%)",
  "Бокс": "hsl(0 72% 51%)",
  "Кикбоксинг": "hsl(0 72% 51%)",
  "Кардио": "hsl(217 70% 50%)",
  "Спиннинг": "hsl(217 70% 50%)",
  "Бодибилдинг": "hsl(25 90% 48%)",
  "Пилатес": "hsl(142 60% 40%)",
};

function getCoachColor(specialty: string): string {
  const parts = specialty.split(",").map(s => s.trim());
  for (const part of parts) {
    if (specialtyColors[part]) return specialtyColors[part];
  }
  return "hsl(0 72% 51%)";
}

export default function CoachesPage() {
  const { data: trainers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/public/trainers"],
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: "hsl(0 0% 5%)" }}>
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(0 72% 51% / 0.08) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollAnimation variant="fade-up">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Баг</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4" data-testid="text-coaches-title">
              Манай дасгалжуулагчид
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Олон улсын гэрчилгээтэй, туршлагатай мэргэжилтнүүд таныг хүлээж байна
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border-white/5 animate-pulse" style={{ background: "hsl(0 0% 8%)" }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full mb-4" style={{ background: "hsl(0 0% 12%)" }} />
                      <div className="h-5 rounded mb-2" style={{ background: "hsl(0 0% 12%)", width: "60%" }} />
                      <div className="h-3 rounded mb-1" style={{ background: "hsl(0 0% 12%)", width: "40%" }} />
                      <div className="h-3 rounded" style={{ background: "hsl(0 0% 12%)", width: "50%" }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(trainers || []).map((coach: any, i: number) => {
                const color = getCoachColor(coach.specialty);
                const initials = (coach.firstName?.charAt(0) || "") + (coach.lastName?.charAt(0) || "");
                const fullName = `${coach.firstName} ${coach.lastName}`;
                return (
                  <ScrollAnimation key={coach.id} variant="fade-up" delay={i * 0.1}>
                    <Card className="group border-white/5 hover-elevate h-full" style={{ background: "hsl(0 0% 8%)" }} data-testid={`coach-card-${i}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <Avatar className="w-24 h-24 transition-transform group-hover:scale-105">
                              <AvatarFallback
                                className="text-2xl font-bold"
                                style={{ background: `${color}30`, color }}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
                              style={{ background: "hsl(142 60% 40%)", borderColor: "hsl(0 0% 8%)" }}
                            >
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-white mb-1">{fullName}</h3>
                          <p className="text-sm font-medium mb-1" style={{ color }}>{coach.specialty}</p>
                          <p className="text-xs text-gray-500 mb-4">{coach.certification}</p>
                          {coach.bio && (
                            <p className="text-sm text-gray-400 leading-relaxed">{coach.bio}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
