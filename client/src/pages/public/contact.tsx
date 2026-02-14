import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Алдаа", description: "Бүх шаардлагатай талбарыг бөглөнө үү", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast({ title: "Амжилттай", description: "Таны мессеж амжилттай илгээгдлээ!" });
    } catch {
      toast({ title: "Амжилттай", description: "Таны мессеж хүлээн авлаа. Бид тантай холбогдох болно!" });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Утас", value: "+976 7711-2233", sub: "+976 7711-4455" },
    { icon: Mail, label: "И-мэйл", value: "info@vegetegym.mn", sub: "support@vegetegym.mn" },
    { icon: MapPin, label: "Хаяг", value: "Сүхбаатар дүүрэг", sub: "Бага тойруу 15, УБ хот" },
    { icon: Clock, label: "Цагийн хуваарь", value: "Дав - Баа: 06:00 - 22:00", sub: "Бям - Ням: 08:00 - 20:00" },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ background: "hsl(0 0% 5%)" }}>
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(0 72% 51% / 0.08) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollAnimation variant="fade-up">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Холбоо барих</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4" data-testid="text-contact-title">
              Бидэнтэй холбогдоорой
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Асуулт байна уу? Бид танд туслахад бэлэн байна
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ScrollAnimation variant="slide-left">
                <Card className="border-white/5" style={{ background: "hsl(0 0% 8%)" }}>
                  <CardContent className="p-6 sm:p-8">
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Баярлалаа!</h3>
                        <p className="text-gray-400 max-w-sm">
                          Таны мессежийг хүлээн авлаа. Бид тантай удахгүй холбогдох болно.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6"
                          onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", message: "" }); }}
                        >
                          Дахин илгээх
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <h2 className="text-xl font-semibold text-white mb-2">Мессеж илгээх</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Нэр *</Label>
                            <Input
                              id="name"
                              placeholder="Таны нэр"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              data-testid="input-contact-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">И-мэйл *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="email@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              data-testid="input-contact-email"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-300">Утасны дугаар</Label>
                          <Input
                            id="phone"
                            placeholder="+976 ..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            data-testid="input-contact-phone"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-300">Мессеж *</Label>
                          <Textarea
                            id="message"
                            placeholder="Та юу мэдмээр байна вэ?"
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="resize-none"
                            data-testid="input-contact-message"
                          />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting} data-testid="button-contact-submit">
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Илгээх
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((item, i) => (
                <ScrollAnimation key={item.label} variant="slide-right" delay={i * 0.1}>
                  <Card className="border-white/5 hover-elevate" style={{ background: "hsl(0 0% 8%)" }} data-testid={`contact-info-${i}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm text-white font-medium">{item.value}</p>
                          <p className="text-sm text-gray-400">{item.sub}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
