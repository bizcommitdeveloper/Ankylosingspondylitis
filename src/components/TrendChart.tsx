"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Entry } from "@/lib/types";

interface TrendPoint {
  date: string;
  basdai?: number;
  basfi?: number;
}

/** Collapse entries into one row per reference date for a combined trend line. */
function toTrend(entries: Entry[]): TrendPoint[] {
  const byDate = new Map<string, TrendPoint>();
  for (const entry of entries) {
    const date = entry.referenceDate || new Date(entry.createdAt).toISOString().slice(0, 10);
    const point = byDate.get(date) ?? { date };
    point[entry.type] = entry.score;
    byDate.set(date, point);
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function TrendChart({ entries }: { entries: Entry[] }) {
  const data = toTrend(entries);

  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No entries yet. Complete a BASDAI or BASFI form to start tracking your trend.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
          <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value: number, name: string) => [value.toFixed(1), name.toUpperCase()]}
          />
          <Line
            type="monotone"
            dataKey="basdai"
            name="BASDAI"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="basfi"
            name="BASFI"
            stroke="#0d9488"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-red-600" /> BASDAI (disease activity)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-brand-600" /> BASFI (function)
        </span>
      </div>
    </div>
  );
}
