"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./progress-ring";
import type { Module } from "@/lib/exercises/modules";

type ModuleStatus = "not-started" | "in-progress" | "complete" | "locked" | "coming-soon";

interface ModuleCardProps {
  module: Module;
  status: ModuleStatus;
  solvedIds: Set<string>;
  progress: { solved: number; total: number; percentage: number };
}

export function ModuleCard({ module, status, solvedIds, progress }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig: Record<ModuleStatus, { label: string; className: string }> = {
    "not-started": { label: "Not Started", className: "bg-muted text-muted-foreground" },
    "in-progress": { label: "In Progress", className: "bg-blue-500/10 text-blue-500" },
    "complete": { label: "Complete", className: "bg-green-500/10 text-green-500" },
    "locked": { label: "Locked", className: "bg-muted text-muted-foreground" },
    "coming-soon": { label: "Coming Soon", className: "bg-muted text-muted-foreground" },
  };

  const isInteractive = status !== "locked" && status !== "coming-soon";
  const config = statusConfig[status];

  return (
    <div className={cn(
      "rounded-lg border bg-card p-4 transition-colors",
      status === "locked" && "opacity-60",
      status === "coming-soon" && "opacity-50",
    )}>
      <div className="flex items-start gap-3">
        <ProgressRing size={48} strokeWidth={3} progress={status === "coming-soon" ? 0 : progress.percentage / 100}>
          <span className="text-lg">{status === "locked" ? "\u{1F512}" : module.icon}</span>
        </ProgressRing>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-muted-foreground">{module.id}</span>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", config.className)}>
              {config.label}
            </span>
          </div>
          <h3 className="font-semibold text-sm">{module.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{module.description}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {module.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                {skill}
              </span>
            ))}
            {module.skills.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{module.skills.length - 4}</span>
            )}
          </div>
        </div>

        {isInteractive && module.exerciseIds.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>

      {expanded && module.exerciseIds.length > 0 && (
        <div className="mt-3 pt-3 border-t space-y-1">
          {module.exerciseIds.map((exId) => {
            const solved = solvedIds.has(exId);
            return (
              <Link
                key={exId}
                href={`/exercise/${exId}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors"
              >
                {solved ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={cn("font-mono truncate", solved && "text-muted-foreground")}>{exId}</span>
              </Link>
            );
          })}
          <div className="text-[10px] text-muted-foreground pt-1">
            {progress.solved}/{progress.total} completed
          </div>
        </div>
      )}
    </div>
  );
}
