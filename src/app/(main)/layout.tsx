"use client";

import Link from "next/link";
import { Sun, Moon, Languages, Github } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { locale, toggle: toggleLocale, t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            <span className="text-emerald-500">Practice</span>Data
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.exercises")}
            </Link>
            <Link href="/roadmap/data-analyst" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.daRoadmap")}
            </Link>
            <Link href="/roadmap/data-engineer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.deRoadmap")}
            </Link>
            <Link href="/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.company")}
            </Link>
            <Link href="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.briefing")}
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLocale} title={locale === "en" ? "Passer en français" : "Switch to English"}>
              <Languages className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex-1">
        {children}
      </div>

      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="font-bold text-base tracking-tight text-foreground">
            <span className="text-emerald-500">Practice</span>Data
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">{t("nav.exercises")}</Link>
            <Link href="/roadmap/data-analyst" className="hover:text-foreground transition-colors">{t("nav.daRoadmap")}</Link>
            <Link href="/roadmap/data-engineer" className="hover:text-foreground transition-colors">{t("nav.deRoadmap")}</Link>
            <Link href="/companies" className="hover:text-foreground transition-colors">{t("nav.company")}</Link>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("footer.tagline")}</span>
            <a
              href="https://github.com/lucaszub/sql-practice"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
