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
      <Topbar title="Assignment" icon={<FileText size={18} />} />

      {isEmpty ? (
        <EmptyAssignments />
      ) : (
        <div className="card p-6 sm:p-7 min-h-[78vh] relative">
          <div className="flex items-start gap-3 mb-5">
            <span className="mt-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Assignments</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <button className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:border-gray-300">
              <Filter size={14} /> Filter By
            </button>
            <div className="relative sm:ml-auto sm:w-[340px]">
              <Search
                size={14}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Assignment"
                className="pill-input pl-11"
              />
            </div>
          </div>

          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
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

          <div className="absolute left-0 right-0 bottom-6 flex justify-center pointer-events-none">
            <Link
              href="/create"
              className="btn-dark pointer-events-auto"
            >
              <Plus size={16} /> Create Assignment
            </Link>
          </div>
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
    <div className="card p-6 relative hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg text-ink-900 underline decoration-[1.5px] decoration-gray-400 underline-offset-[6px]">
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
      <div className="mt-10 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-ink-900">
          <strong className="font-semibold">Assigned on</strong> :{' '}
          <span className="text-gray-600">{created}</span>
        </span>
        <span className="text-ink-900">
          <strong className="font-semibold">Due</strong> :{' '}
          <span className="text-gray-600">{due}</span>
        </span>
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
