"use client";

import type { Question } from "@/lib/questions";

interface ScaleSliderProps {
  index: number;
  question: Question;
  value: number;
  onChange: (value: number) => void;
}

export function ScaleSlider({ index, question, value, onChange }: ScaleSliderProps) {
  const readout = question.formatValue ? question.formatValue(value) : value.toFixed(question.step < 1 ? 1 : 0);
  const inputId = `q-${index}`;

  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
        <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
          {index + 1}
        </span>
        {question.text}
      </label>

      <div className="mt-4 flex items-center gap-4">
        <input
          id={inputId}
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-describedby={`${inputId}-readout`}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 dark:bg-slate-600"
        />
        <output
          id={`${inputId}-readout`}
          htmlFor={inputId}
          className="w-16 shrink-0 text-right text-base font-semibold tabular-nums text-brand-700 dark:text-brand-300"
        >
          {readout}
        </output>
      </div>

      <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>

      {question.ticks ? (
        <div className="mt-2 flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
          {question.ticks.map((tick) => (
            <span key={tick.value}>{tick.label}</span>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
