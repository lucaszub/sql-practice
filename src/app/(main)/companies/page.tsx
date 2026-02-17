"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { companies } from "@/lib/companies";
import { Badge } from "@/components/ui/badge";

export default function CompaniesPage() {
  const { locale, t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("companies.title")}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t("companies.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => {
          const tagline = locale === "fr" ? company.taglineFr : company.tagline;
          const sector = locale === "fr" ? company.sectorFr : company.sector;
          const track = locale === "fr" ? company.trackFr : company.track;

          if (company.ready) {
            return (
              <Link
                key={company.id}
                href={`/company/${company.id}`}
                className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-md hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{company.icon}</span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-lg">{company.name}</h2>
                    <p className="text-sm text-muted-foreground">{tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {sector}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {track}
                  </Badge>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={company.id}
              className="rounded-xl border bg-card p-5 space-y-3 opacity-60 cursor-default"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{company.icon}</span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg">{company.name}</h2>
                  <p className="text-sm text-muted-foreground">{tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {sector}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {track}
                </Badge>
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {t("companies.comingSoon")}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
