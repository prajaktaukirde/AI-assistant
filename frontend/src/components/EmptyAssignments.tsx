'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function EmptyAssignments() {
  return (
    <div className="relative card mx-auto flex min-h-[calc(100vh-11rem)] max-w-[520px] w-full flex-col items-center justify-center gap-8 px-6 py-10 text-center overflow-hidden">
      <Link
        href="/create"
        className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)] transition hover:bg-black"
        aria-label="Create Assignment"
      >
        <Plus size={22} />
      </Link>

      <EmptyArt />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink-900">No assignments yet</h2>
        <p className="mx-auto max-w-[340px] text-sm text-gray-500 leading-relaxed">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link
          href="/create"
          className="btn-dark mt-2 w-full justify-center max-w-[280px]"
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
    <div className="relative mx-auto w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-transparent" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[148px] h-[148px] rounded-[36px] bg-white border border-gray-200 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]">
          <div className="absolute -top-4 right-[-10px] flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-rose-600 shadow-sm">
            <span className="text-xl font-black">×</span>
          </div>
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <div className="h-3 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="mt-11 space-y-2 px-4">
            <div className="h-3 rounded-full bg-gray-200" />
            <div className="h-3 rounded-full bg-gray-200 w-5/6 mx-auto" />
            <div className="h-3 rounded-full bg-gray-200 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
