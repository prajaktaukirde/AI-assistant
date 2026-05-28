'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function EmptyAssignments() {
  return (
    <div className="card grid place-items-center text-center min-h-[78vh] px-6 relative overflow-hidden">
      <div>
        <EmptyArt />
        <h2 className="mt-8 text-2xl font-bold text-ink-900">
          No assignments yet
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let
          AI assist with grading.
        </p>
        <Link
          href="/create"
          className="btn-dark mt-8 inline-flex"
        >
          <Plus size={16} />
          Create Your First Assignment
        </Link>
      </div>
    </div>
  );
}

function EmptyArt() {
  return (
    <div className="relative mx-auto w-[260px] h-[260px]">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #f1f1f4 0%, #ececef 60%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        <path
          d="M55 60 C 90 30, 110 60, 100 80"
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="195" cy="170" r="3" fill="#3b82f6" />
        <circle cx="60" cy="190" r="3" fill="#fbbf24" />
        <path d="M85 145 L 80 152 M 90 142 L 95 138" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div
          className="relative w-[140px] h-[170px] rounded-xl bg-white border border-gray-200 px-4 pt-4 flex flex-col gap-2.5"
          style={{ boxShadow: '0 12px 32px -12px rgba(0,0,0,0.18)' }}
        >
          <div className="h-2 w-16 rounded bg-ink-900" />
          <div className="h-1.5 w-24 rounded bg-gray-200" />
          <div className="h-1.5 w-20 rounded bg-gray-200" />
          <div className="h-1.5 w-24 rounded bg-gray-200" />
          <div className="h-1.5 w-16 rounded bg-gray-200" />
          <div className="h-1.5 w-20 rounded bg-gray-200" />

          <div className="absolute -top-3 -right-6 rounded-md bg-white border border-gray-200 px-2 py-1.5 shadow-md">
            <div className="h-1 w-7 rounded bg-gray-300" />
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 100 100"
        className="absolute"
        style={{
          width: 130,
          height: 130,
          right: 6,
          bottom: 18,
        }}
      >
        <circle
          cx="42"
          cy="42"
          r="32"
          fill="white"
          stroke="#a78bfa"
          strokeWidth="6"
        />
        <line
          x1="65"
          y1="65"
          x2="92"
          y2="92"
          stroke="#a78bfa"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M30 30 L 54 54 M 54 30 L 30 54"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
