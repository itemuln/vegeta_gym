import { useQuery } from "@tanstack/react-query";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Dumbbell,
  Target,
  Flame,
  Heart,
  Timer,
  Wind,
  Bike,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Zap, Dumbbell, Target, Flame, Heart, Timer, Wind, Bike,
};

function difficultyColor(level: string) {
  if (level.includes("Анхан")) return "text-green-400";
  if (level.includes("Ахисан")) return "text-red-400";
  return "text-yellow-400";
}

export default function CoursesPage() {
  const { data: courses, isLoading } = useQuery<any[]>({
    queryKey: ["/api/public/courses"],
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: "hsl(0 0% 5%)" }}>
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(0 72% 51% / 0.08) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollAnimation variant="fade-up">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Хичээлүүд</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4" data-testid="text-courses-title">
              Бэлтгэлийн хөтөлбөрүүд
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Таны зорилгод нийцсэн олон төрлийн хичээлүүдээс сонгоорой
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} className="border-white/5 animate-pulse" style={{ background: "hsl(0 0% 8%)" }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-md" style={{ background: "hsl(0 0% 12%)" }} />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 rounded" style={{ background: "hsl(0 0% 12%)", width: "40%" }} />
                        <div className="h-3 rounded" style={{ background: "hsl(0 0% 12%)", width: "100%" }} />
                        <div className="h-3 rounded" style={{ background: "hsl(0 0% 12%)", width: "80%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(courses || []).map((course: any, i: number) => {
                const IconComp = iconMap[course.icon] || Dumbbell;
                return (
                  <ScrollAnimation key={course.id} variant="fade-up" delay={i * 0.08}>
                    <Card className="group border-white/5 hover-elevate h-full" style={{ background: "hsl(0 0% 8%)" }} data-testid={`course-card-${i}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                            style={{ background: `${course.color}20` }}
                          >
                            <IconComp className="w-6 h-6" style={{ color: course.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">{course.description}</p>
                            <div className="flex items-center flex-wrap gap-3 text-xs">
                              <span className={`font-medium ${difficultyColor(course.difficulty)}`}>
                                {course.difficulty}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span className="text-gray-400 flex items-center gap-1">
                                <Timer className="w-3 h-3" /> {course.duration}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span className="text-gray-400">{course.schedule}</span>
                            </div>
                          </div>
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
