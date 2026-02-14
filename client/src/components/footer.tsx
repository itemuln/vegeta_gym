import { Link } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-primary">FORCE</span>
                  <span className="text-foreground">GYM</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Монголын тэргүүлэх фитнесс клуб. Таны эрүүл мэнд, хүч чадлыг бид хамтдаа бүтээнэ.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover-elevate"
                whileHover={{ y: -2 }}
                data-testid="link-instagram"
              >
                <SiInstagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover-elevate"
                whileHover={{ y: -2 }}
                data-testid="link-facebook"
              >
                <SiFacebook className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover-elevate"
                whileHover={{ y: -2 }}
                data-testid="link-youtube"
              >
                <SiYoutube className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Хуудсууд</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Нүүр хуудас" },
                { href: "/locations", label: "Салбарууд" },
                { href: "/courses", label: "Хичээлүүд" },
                { href: "/coaches", label: "Дасгалжуулагчид" },
                { href: "/contact", label: "Холбоо барих" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground cursor-pointer transition-colors hover:text-primary" data-testid={`footer-link-${link.href.replace("/", "") || "home"}`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Ажлын цаг</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Даваа - Баасан</p>
                  <p className="text-sm text-muted-foreground">06:00 - 23:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Бямба - Ням</p>
                  <p className="text-sm text-muted-foreground">08:00 - 20:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Сүхбаатарын талбайн зүүн тал, Улаанбаатар
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+976 7711-2233</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">info@forcegym.mn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 ForceGym. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
