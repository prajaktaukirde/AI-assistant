'use client';

import { forwardRef } from 'react';
import type { Paper } from '@/lib/api';

interface Props {
  paper: Paper;
}

export const PaperView = forwardRef<HTMLDivElement, Props>(function PaperView(
  { paper },
  ref
) {
  let qNum = 0;
  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-10 text-ink-900"
    >
      <header className="text-center">
        <h1 className="text-2xl sm:text-[26px] font-bold">
          {paper.schoolName}
        </h1>
        <p className="mt-2 text-base">
          <strong>Subject:</strong> {paper.subject}
        </p>
        <p className="text-base">
          <strong>Class:</strong> {paper.grade}
        </p>
      </header>

      <div className="mt-8 flex items-start justify-between text-sm">
        <p>
          <strong>Time Allowed:</strong> {paper.durationMinutes} minutes
        </p>
        <p>
          <strong>Maximum Marks:</strong> {paper.totalMarks}
        </p>
      </div>

      {paper.generalInstructions?.length > 0 && (
        <div className="mt-4 text-sm">
          {paper.generalInstructions.map((g, i) => (
            <p key={i} className="font-medium">
              {g}
            </p>
          ))}
        </div>
      )}

      <div className="mt-6 text-sm space-y-2 font-mono">
        <p>Name: ______________________</p>
        <p>Roll Number: ______________________</p>
        <p>
          Class: {paper.grade} Section: ______________________
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {paper.sections.map((s, idx) => (
          <section key={idx}>
            <h2 className="text-center text-lg font-bold">{s.title}</h2>
            <h3 className="mt-4 text-base font-semibold">
              {capitalizeType(s.questions[0]?.type || '')}
            </h3>
            {s.instruction && (
              <p className="italic text-sm text-gray-700 mt-1 mb-3">
                {s.instruction}
              </p>
            )}
            <ol className="space-y-2 text-[15px]">
              {s.questions.map((q, i) => {
                qNum += 1;
                return (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-none w-6 text-right">{qNum}.</span>
                    <div className="flex-1">
                      <p>{q.text}</p>
                      {q.options && q.options.length > 0 && (
                        <ol className="mt-1.5 ml-4 list-[lower-alpha] text-sm space-y-0.5 text-gray-800">
                          {q.options.map((o, oi) => (
                            <li key={oi}>{o}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <p className="mt-10 font-semibold">End of Question Paper</p>

      {paper.answerKey && paper.answerKey.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Answer Key:</h2>
          <ol className="list-decimal pl-6 space-y-2 text-[15px]">
            {paper.answerKey.map((ans, i) => (
              <li key={i} className="whitespace-pre-line">
                {ans}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
});

function capitalizeType(t: string) {
  if (!t) return '';
  if (t.toLowerCase().includes('multiple')) return 'Multiple Choice Questions';
  if (t.toLowerCase().includes('short')) return 'Short Answer Questions';
  if (t.toLowerCase().includes('long')) return 'Long Answer Questions';
  if (t.toLowerCase().includes('numerical')) return 'Numerical Problems';
  if (t.toLowerCase().includes('diagram')) return 'Diagram-Based Questions';
  if (t.toLowerCase().includes('true')) return 'True / False';
  if (t.toLowerCase().includes('fill')) return 'Fill in the Blanks';
  return t;
}
