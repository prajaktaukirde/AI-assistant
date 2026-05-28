'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Plus,
  Search,
  MoreVertical,
  FileText,
  Trash2,
  Eye,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { EmptyAssignments } from '@/components/EmptyAssignments';
import {
  AssessmentSummary,
  deleteAssessment,
  listAssessments,
} from '@/lib/api';

export default function AssignmentsPage() {
  const [items, setItems] = useState<AssessmentSummary[] | null>(null);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  async function load() {
    try {
      const data = await listAssessments();
      setItems(data);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    setOpenMenu(null);
    setItems((prev) => prev?.filter((a) => a._id !== id) || []);
    try {
      await deleteAssessment(id);
    } catch {
      load();
    }
  }

  const filtered =
    items?.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase().trim())
    ) || [];

  const isEmpty = items !== null && items.length === 0;
  const isLoading = items === null;

  return (
    <AppShell assignmentsCount={items?.length}>
      <Topbar title="Assignments" icon={<FileText size={18} />} />

      {isEmpty ? (
        <EmptyAssignments />
      ) : (
        <div className="mx-auto w-full max-w-[720px] space-y-4 pb-28">
          <div className="rounded-[30px] border border-[#E3E5EE] bg-[#F4F5F8] p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Assignments</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and create assignments for your classes.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#D9DBE6] bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                <Filter size={14} /> Filter
              </button>
              <div className="relative flex-1">
                <div className="relative rounded-full border border-[#D9DBE6] bg-white px-4 py-3 shadow-sm">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Name"
                    className="w-full border-0 bg-transparent pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((a) => (
                <AssignmentCard
                  key={a._id}
                  a={a}
                  open={openMenu === a._id}
                  onToggleMenu={() =>
                    setOpenMenu((prev) => (prev === a._id ? null : a._id))
                  }
                  onDelete={() => onDelete(a._id)}
                />
              ))}
            </div>
          )}

          <Link
            href="/create"
            className="fixed right-4 bottom-24 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0F172A] border border-[#E6E8F2] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.16)] md:hidden"
            aria-label="Create Assignment"
          >
            <Plus size={24} />
          </Link>
        </div>
      )}
    </AppShell>
  );
}

function AssignmentCard({
  a,
  open,
  onToggleMenu,
  onDelete,
}: {
  a: AssessmentSummary;
  open: boolean;
  onToggleMenu: () => void;
  onDelete: () => void;
}) {
  const created = a.createdAt ? formatDate(new Date(a.createdAt)) : '—';
  const due = a.dueDate ? formatDate(new Date(a.dueDate)) : '—';
  return (
    <div className="relative rounded-[28px] border border-[#E6E8F2] bg-white p-4 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-lg text-slate-900 truncate">
          {a.title}
        </h3>
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleMenu();
            }}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100 z-10 relative"
          >
            <MoreVertical size={18} />
          </button>
          {open && (
            <div className="absolute right-0 top-10 w-44 rounded-2xl border border-gray-100 bg-white py-2 z-20 shadow-xl">
              <Link
                href={`/result/${a._id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-ink-900 hover:bg-gray-50"
              >
                <Eye size={14} /> View Assignment
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 grid gap-2 text-sm text-slate-600">
        <div>
          <span className="font-semibold text-slate-900">Assigned on</span> : {created}
        </div>
        <div>
          <span className="font-semibold text-slate-900">Due</span> : {due}
        </div>
      </div>
      <Link
        href={`/result/${a._id}`}
        className="absolute inset-0 rounded-3xl"
        aria-label={`Open ${a.title}`}
        onClick={(e) => {
          if (open) e.preventDefault();
        }}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="mt-10 flex justify-between">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
