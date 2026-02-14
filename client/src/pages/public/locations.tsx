import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Building2 } from "lucide-react";

const branches = [
  {
    name: "Vegete Gym - Төв салбар",
    address: "Сүхбаатар дүүрэг, Бага тойруу 15, Улаанбаатар",
    phone: "+976 7711-2233",
    hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
    features: ["CrossFit зал", "Саун & усан сан", "Хувийн шүүгээ", "Зогсоол"],
  },
  {
    name: "Vegete Gym - Баянгол салбар",
    address: "Баянгол дүүрэг, Энхтайвны өргөн чөлөө 23, Улаанбаатар",
    phone: "+976 7711-4455",
    hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
    features: ["Бокс зал", "Кардио зон", "Хувийн шүүгээ", "Кафе"],
  },
  {
    name: "Vegete Gym - Хан-Уул салбар",
    address: "Хан-Уул дүүрэг, Чингисийн өргөн чөлөө 40, Улаанбаатар",
    phone: "+976 7711-6677",
    hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
    features: ["Йог студи", "Функциональ зон", "Хувийн шүүгээ", "Зогсоол"],
  },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen pt-16" style={{ background: "hsl(0 0% 5%)" }}>
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(0 72% 51% / 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollAnimation variant="fade-up">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Салбарууд</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4" data-testid="text-locations-title">
              Бидний салбарууд
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Улаанбаатар хотын 3 стратегийн байршилд таныг хүлээж байна
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {branches.map((branch, i) => (
              <ScrollAnimation key={branch.name} variant="fade-up" delay={i * 0.12}>
                <Card className="group border-white/5 hover-elevate h-full" style={{ background: "hsl(0 0% 8%)" }} data-testid={`location-card-${i}`}>
                  <CardContent className="p-0">
                    <div className="h-48 relative overflow-hidden rounded-t-md" style={{ background: `linear-gradient(135deg, hsl(0 72% 51% / 0.2) 0%, hsl(0 0% 10%) 100%)` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-primary/30" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, hsl(0 0% 8%), transparent)" }}>
                        <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-300">{branch.address}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-300">{branch.phone}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <div className="text-sm text-gray-300">
                          {branch.hours.split("\n").map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Онцлог</p>
                        <div className="flex flex-wrap gap-2">
                          {branch.features.map((f) => (
                            <span key={f} className="px-2.5 py-1 rounded-md text-xs text-gray-300 border border-white/10" style={{ background: "hsl(0 0% 12%)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation variant="fade-up">
            <Card className="border-white/5 overflow-hidden" style={{ background: "hsl(0 0% 8%)" }}>
              <CardContent className="p-0">
                <div className="h-64 sm:h-80 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)" }}>
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Газрын зураг</p>
                    <p className="text-gray-500 text-xs mt-1">Улаанбаатар хот, Монгол</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
