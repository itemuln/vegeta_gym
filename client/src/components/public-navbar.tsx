import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Нүүр" },
  { href: "/locations", label: "Салбарууд" },
  { href: "/courses", label: "Хичээлүүд" },
  { href: "/coaches", label: "Дасгалжуулагч" },
  { href: "/contact", label: "Холбоо барих" },
];

export function PublicNavbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer" data-testid="public-logo">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Vegete Gym
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    location === link.href
                      ? "text-primary"
                      : "text-gray-300 hover:text-white"
                  }`}
                  data-testid={`public-nav-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-admin-login">
                Админ
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" data-testid="button-nav-contact">
                Гишүүн болох
              </Button>
            </Link>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/5"
            style={{ background: "rgba(0,0,0,0.95)" }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      location === link.href
                        ? "text-primary bg-primary/10"
                        : "text-gray-300"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Админ нэвтрэх
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
