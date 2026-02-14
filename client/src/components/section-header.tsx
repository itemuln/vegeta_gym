import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeader({ badge, title, description, align = "center", light }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`space-y-3 ${align === "center" ? "text-center max-w-2xl mx-auto" : ""}`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-md ${
            light
              ? "bg-white/10 text-white/90"
              : "bg-primary/10 text-primary"
          }`}
        >
          {badge}
        </motion.span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            light ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
