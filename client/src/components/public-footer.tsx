import { Link } from "wouter";
import { Dumbbell, Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5" style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-white">Vegete Gym</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Монголын тэргүүлэгч фитнесс клубын сүлжээ. Таны эрүүл мэнд, хүч чадлыг дэмжинэ.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Хуудсууд</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Нүүр хуудас" },
                { href: "/locations", label: "Салбарууд" },
                { href: "/courses", label: "Хичээлүүд" },
                { href: "/coaches", label: "Дасгалжуулагч" },
                { href: "/contact", label: "Холбоо барих" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Хичээлүүд</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>CrossFit</li>
              <li>Хүч чадлын бэлтгэл</li>
              <li>Бокс</li>
              <li>Функциональ дасгал</li>
              <li>Йог</li>
              <li>Кардио</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +976 7711-2233
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                info@vegetegym.mn
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Улаанбаатар хот, Сүхбаатар дүүрэг
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; 2026 Vegete Gym. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Нууцлалын бодлого</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Үйлчилгээний нөхцөл</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
