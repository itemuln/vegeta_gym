import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const coaches = [
  {
    name: "Бат-Эрдэнэ Отгонбаяр",
    initials: "БО",
    specialty: "CrossFit, Хүч чадал",
    cert: "NASM-CPT, CrossFit L3",
    bio: "10 гаруй жилийн туршлагатай мэргэжлийн дасгалжуулагч. CrossFit Games тэмцээнд олон удаа оролцсон. Тамирчдыг олон улсын тэмцээнд бэлтгэж байсан туршлагатай.",
    color: "hsl(0 72% 51%)",
  },
  {
    name: "Сарантуяа Батбаяр",
    initials: "СБ",
    specialty: "Йог, Уян хатан",
    cert: "ACE-CPT, RYT-500",
    bio: "Энэтхэг, Бали-д сургалтанд хамрагдсан йогийн мэргэшсэн багш. 8 жилийн туршлагатай. Виньяса, хатха, инь йогийн хэв маягуудаар мэргэшсэн.",
    color: "hsl(280 55% 50%)",
  },
  {
    name: "Ганбат Дорж",
    initials: "ГД",
    specialty: "Бокс, Кикбоксинг",
    cert: "NASM-CPT, Boxing A",
    bio: "Монголын мэргэжлийн боксын тэмцээнд алтан медаль хүртсэн. Залуу тамирчдыг олон улсын тэмцээнд амжилттай бэлтгэж ирсэн 12 жилийн туршлагатай.",
    color: "hsl(0 72% 51%)",
  },
  {
    name: "Оюунчимэг Нямдорж",
    initials: "ОН",
    specialty: "Кардио, Спиннинг",
    cert: "ACE-CPT, Spinning",
    bio: "Кардио болон спиннинг хичээлүүдийн мэргэшсэн багш. Жинг хасах, тэсвэр хатуужлыг хөгжүүлэх чиглэлээр онцгой мэргэшсэн. 7 жилийн туршлагатай.",
    color: "hsl(217 70% 50%)",
  },
  {
    name: "Тэмүүлэн Жаргалсайхан",
    initials: "ТЖ",
    specialty: "Хүч чадал, Бодибилдинг",
    cert: "NASM-CPT, CSCS",
    bio: "Монголын бодибилдингийн аварга шалгаруулах тэмцээний мөнгөн медальт. Хувийн дасгалын хөтөлбөр зохиох, хоол тэжээлийн зөвлөгөө өгөх чиглэлээр мэргэшсэн.",
    color: "hsl(25 90% 48%)",
  },
  {
    name: "Энхжин Мөнхбат",
    initials: "ЭМ",
    specialty: "Пилатес, Уян хатан",
    cert: "ACE-CPT, Pilates",
    bio: "Пилатес, уян хатан чанарын хичээлүүдэд мэргэшсэн. Гэмтлээс сэргэх, нурууны өвчинтэй хүмүүст зориулсан тусгай хөтөлбөр зохиодог. 6 жилийн туршлагатай.",
    color: "hsl(142 60% 40%)",
  },
];

export default function CoachesPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach, i) => (
              <ScrollAnimation key={coach.name} variant="fade-up" delay={i * 0.1}>
                <Card className="group border-white/5 hover-elevate h-full" style={{ background: "hsl(0 0% 8%)" }} data-testid={`coach-card-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <Avatar className="w-24 h-24 transition-transform group-hover:scale-105">
                          <AvatarFallback
                            className="text-2xl font-bold text-white"
                            style={{ background: `${coach.color}30`, color: coach.color }}
                          >
                            {coach.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
                          style={{ background: "hsl(142 60% 40%)", borderColor: "hsl(0 0% 8%)" }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-1">{coach.name}</h3>
                      <p className="text-sm font-medium mb-1" style={{ color: coach.color }}>{coach.specialty}</p>
                      <p className="text-xs text-gray-500 mb-4">{coach.cert}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{coach.bio}</p>
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
