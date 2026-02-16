"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

export function SqlEditor({ value, onChange, onRun, isRunning }: SqlEditorProps) {
  const { t } = useLocale();

  const runKeymap = keymap.of([
    {
      key: "Ctrl-Enter",
      mac: "Cmd-Enter",
      run: () => {
        onRun();
        return true;
      },
    },
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
        <span className="text-sm font-medium">{t("exercise.sqlEditor")}</span>
        <Button onClick={onRun} size="sm" disabled={isRunning}>
          {isRunning ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Send className="mr-1.5 h-3 w-3" />
          )}
          {isRunning ? t("exercise.running") : t("exercise.submit")}
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[sql({ dialect: PostgreSQL }), runKeymap]}
          theme={oneDark}
          height="100%"
          className="h-full"
        />
      </div>
    </div>
  );
}
