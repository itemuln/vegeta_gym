import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const courses = [
  {
    icon: Zap,
    title: "CrossFit",
    desc: "Өндөр эрчимтэй интервал дасгалуудыг хослуулсан функциональ фитнесс хөтөлбөр. Жин өргөлт, гимнастик, кардио зэрэг олон төрлийн дасгалуудыг хамарна. Бие бялдрын бүх чанарыг хөгжүүлнэ.",
    difficulty: "Дунд - Ахисан",
    duration: "60 мин",
    schedule: "Даваа, Лхагва, Баасан",
    color: "hsl(0 72% 51%)",
  },
  {
    icon: Dumbbell,
    title: "Хүч чадлын бэлтгэл",
    desc: "Чөлөөт жин, тоног төхөөрөмж ашиглан булчингийн хүч, тэсвэр, хэмжээг нэмэгдүүлэх зорилготой хөтөлбөр. Хувийн зорилгод тохирсон дасгалын төлөвлөгөөг бий болгоно.",
    difficulty: "Бүх түвшин",
    duration: "75 мин",
    schedule: "Мягмар, Пүрэв, Бямба",
    color: "hsl(25 90% 48%)",
  },
  {
    icon: Target,
    title: "Бокс & Кикбоксинг",
    desc: "Мэргэжлийн боксын дасгалжуулагчтай хамтран тулааны урлагийн техник, хүч чадал, хурд, рефлексийг хөгжүүлэх хичээлүүд. Стрессийг тайлах хамгийн үр дүнтэй арга.",
    difficulty: "Дунд",
    duration: "60 мин",
    schedule: "Даваа, Лхагва, Баасан",
    color: "hsl(0 72% 51%)",
  },
  {
    icon: Flame,
    title: "Функциональ дасгал",
    desc: "Өдөр тутмын хөдөлгөөнийг сайжруулах зорилготой, бие бүрэн хөдөлгөөнт дасгалуудын хөтөлбөр. Тэнцвэр, уян хатан, координаци болон хүч чадлыг зэрэг хөгжүүлнэ.",
    difficulty: "Бүх түвшин",
    duration: "50 мин",
    schedule: "Даваа - Баасан",
    color: "hsl(25 90% 48%)",
  },
  {
    icon: Heart,
    title: "Йог & Пилатес",
    desc: "Бие сэтгэлийн тэнцвэрийг олоход туслах, уян хатан чанарыг хөгжүүлэх, стрессийг бууруулах зорилготой хичээлүүд. Виньяса, хатха, инь йогийн хэв маягууд.",
    difficulty: "Анхан шат",
    duration: "60 мин",
    schedule: "Мягмар, Пүрэв, Бямба",
    color: "hsl(142 60% 40%)",
  },
  {
    icon: Bike,
    title: "Спиннинг / Кардио",
    desc: "Дугуйн дасгал дээр суурилсан өндөр эрчимтэй кардио хичээл. Зүрхний булчин, тэсвэр хатуужлыг хөгжүүлж, өөхийг шатаах хамгийн хурдан арга.",
    difficulty: "Бүх түвшин",
    duration: "45 мин",
    schedule: "Даваа - Баасан",
    color: "hsl(217 70% 50%)",
  },
  {
    icon: Wind,
    title: "HIIT",
    desc: "Өндөр эрчимтэй интервал бэлтгэл. Богино хугацаанд хамгийн их калори шатааж, бодисын солилцоог идэвхжүүлэх зорилготой дасгалуудын цуврал.",
    difficulty: "Ахисан",
    duration: "30 мин",
    schedule: "Лхагва, Баасан",
    color: "hsl(0 72% 51%)",
  },
  {
    icon: Timer,
    title: "Табата",
    desc: "20 секунд дасгал, 10 секунд амрах зарчмаар явагддаг 4 минутын тойргуудаас бүрдсэн өндөр эрчимтэй бэлтгэлийн хөтөлбөр.",
    difficulty: "Дунд - Ахисан",
    duration: "40 мин",
    schedule: "Мягмар, Пүрэв",
    color: "hsl(280 55% 50%)",
  },
];

function difficultyColor(level: string) {
  if (level.includes("Анхан")) return "text-green-400";
  if (level.includes("Ахисан")) return "text-red-400";
  return "text-yellow-400";
}

export default function CoursesPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course, i) => (
              <ScrollAnimation key={course.title} variant="fade-up" delay={i * 0.08}>
                <Card className="group border-white/5 hover-elevate h-full" style={{ background: "hsl(0 0% 8%)" }} data-testid={`course-card-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                        style={{ background: `${course.color}20` }}
                      >
                        <course.icon className="w-6 h-6" style={{ color: course.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{course.desc}</p>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
