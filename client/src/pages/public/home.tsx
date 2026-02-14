import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Shield,
  Users,
  Clock,
  Trophy,
  Zap,
  Target,
  Heart,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const programs = [
  {
    icon: Zap,
    title: "CrossFit",
    desc: "Өндөр эрчимтэй функциональ дасгалууд. Бүх түвшний тамирчдад тохиромжтой.",
  },
  {
    icon: Dumbbell,
    title: "Хүч чадал",
    desc: "Чөлөөт жин болон тоног төхөөрөмжөөр хүч чадлаа хөгжүүлээрэй.",
  },
  {
    icon: Target,
    title: "Бокс",
    desc: "Мэргэжлийн дасгалжуулагчтай бокс, кикбоксингийн хичээлүүд.",
  },
  {
    icon: Heart,
    title: "Йог & Уян хатан",
    desc: "Бие сэтгэлийн тэнцвэрийг олоход туслах йог, пилатесийн хичээлүүд.",
  },
];

const reasons = [
  {
    icon: Trophy,
    title: "Мэргэжлийн баг",
    desc: "Олон улсын гэрчилгээтэй дасгалжуулагчид таныг удирдана.",
  },
  {
    icon: Shield,
    title: "Орчин үеийн тоног төхөөрөмж",
    desc: "Дэлхийн шилдэг брэндийн тоног төхөөрөмжүүдээр тоноглогдсон.",
  },
  {
    icon: Clock,
    title: "Уян цагийн хуваарь",
    desc: "Өглөө 06:00-оос шөнийн 22:00 хүртэл ажиллана.",
  },
  {
    icon: Users,
    title: "Нөхөрсөг нийгэмлэг",
    desc: "Хамтдаа хөгжиж, бие биенээ дэмжих тамирчдын нийгэмлэг.",
  },
];

const stats = [
  { value: 2500, suffix: "+", label: "Идэвхтэй гишүүд" },
  { value: 15, suffix: "+", label: "Мэргэжлийн дасгалжуулагч" },
  { value: 3, suffix: "", label: "Салбар" },
  { value: 50, suffix: "+", label: "Долоо хоног тутмын хичээл" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 30%, #0d0d0d 60%, #0a0a0a 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(0 72% 51% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(0 72% 51% / 0.15) 0%, transparent 40%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[1]" style={{ background: "linear-gradient(to top, hsl(0 0% 5%), transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-primary border border-primary/30 mb-6" style={{ background: "hsl(0 72% 51% / 0.1)" }}>
              Монголын тэргүүлэгч фитнесс клуб
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            data-testid="text-hero-title"
          >
            Хүчтэй бие бялдар,{" "}
            <span className="text-primary">хүчтэй оюун санаа</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            Vegete Gym-д тавтай морил. Мэргэжлийн дасгалжуулагч, орчин үеийн тоног төхөөрөмжөөр таны зорилгод хүрэхэд бид тусална.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          >
            <Link href="/contact">
              <Button size="lg" className="text-base px-8" data-testid="button-hero-join">
                Гишүүн болох
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-hero-contact">
                Холбогдох
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28 relative" style={{ background: "hsl(0 0% 5%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation variant="fade-up" className="text-center mb-14">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Хөтөлбөрүүд</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Бидний онцлох хичээлүүд
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Таны зорилгод нийцсэн олон төрлийн хичээлүүдээс сонгоорой
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map((prog, i) => (
              <ScrollAnimation key={prog.title} variant="fade-up" delay={i * 0.1}>
                <Card className="group border-white/5 hover-elevate cursor-pointer h-full" style={{ background: "hsl(0 0% 8%)" }}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <prog.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{prog.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{prog.desc}</p>
                    <Link href="/courses">
                      <span className="inline-flex items-center text-primary text-sm mt-4 cursor-pointer group-hover:gap-2 transition-all gap-1">
                        Дэлгэрэнгүй <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(0 72% 51% / 0.15) 0%, hsl(0 0% 5%) 60%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((stat, i) => (
              <ScrollAnimation key={stat.label} variant="scale-in" delay={i * 0.1}>
                <div className="text-center" data-testid={`stat-${i}`}>
                  <div className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28" style={{ background: "hsl(0 0% 5%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation variant="fade-up" className="text-center mb-14">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Давуу тал</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Яагаад биднийг сонгох вэ?
            </h2>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reasons.map((r, i) => (
              <ScrollAnimation key={r.title} variant="fade-up" delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <r.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{r.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" style={{ background: "hsl(0 0% 4%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollAnimation variant="scale-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Өнөөдрөөс эхэл
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Таны фитнесс аялал энд эхэлнэ. Бидэнтэй нэгдэж, илүү эрүүл, хүчтэй хувилбараа бий болго.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="text-base px-8" data-testid="button-cta-join">
                  Бүртгүүлэх
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Хичээлүүд үзэх
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
