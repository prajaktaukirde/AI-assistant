'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface Props {
  progress: number;
  message: string;
}

export function GeneratingState({ progress, message }: Props) {
  const steps = [
    { at: 10, label: 'Building structured prompt' },
    { at: 35, label: 'Calling AI model' },
    { at: 80, label: 'Validating & sectioning' },
    { at: 100, label: 'Ready' },
  ];

  return (
    <div className="card p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        {progress < 100 ? (
          <Loader2 className="animate-spin" size={26} />
        ) : (
          <Sparkles size={26} />
        )}
      </div>
      <h2 className="mt-5 text-xl font-semibold">
        {progress < 100 ? 'Generating your paper…' : 'Paper ready'}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        {message || 'Hang tight while AI structures your questions.'}
      </p>

      <div className="mt-6 mx-auto max-w-md">
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-ink-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">{progress}%</p>
      </div>

      <ol className="mt-8 mx-auto max-w-sm text-left text-sm space-y-2">
        {steps.map((s) => {
          const done = progress >= s.at;
          return (
            <li key={s.at} className="flex items-center gap-3">
              <span
                className={
                  done
                    ? 'h-2 w-2 rounded-full bg-brand-500'
                    : 'h-2 w-2 rounded-full bg-gray-200'
                }
              />
              <span className={done ? 'text-ink-900' : 'text-gray-400'}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
