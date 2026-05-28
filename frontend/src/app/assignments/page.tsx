'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  LayoutGrid,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
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
      
      {/* ====== GLOBAL TOP PLATFORM HEADER BAR (Desktop Only) ====== */}
      <div className="hidden md:flex bg-white border-b border-gray-100 px-6 py-3 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button type="button" className="p-1 hover:bg-gray-50 rounded-lg text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
            <LayoutGrid size={16} className="text-gray-400" />
            <span>Assignment</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="relative p-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
            <Bell size={18} />
          </button>
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1 border border-gray-100 cursor-pointer hover:bg-gray-100/80 transition-colors">
            <div className="h-6 w-6 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-xs font-bold text-orange-700">
              JD
            </div>
            <span className="text-xs font-bold text-gray-800">John Doe</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-gray-400 ml-1">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <EmptyAssignments />
      ) : (
        <div className="min-h-screen bg-[#F4F5F8] px-4 md:px-6 py-4 md:py-6 max-w-[1400px] mx-auto relative font-sans">
          
          {/* ====== BRANDING SUB-HEADER BLOCK (Desktop Only) ====== */}
          <div className="hidden md:flex items-start gap-2.5 mb-5">
            <span className="mt-2 h-3.5 w-3.5 rounded-full bg-[#4ade80] ring-4 ring-green-100 shrink-0" />
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">Assignments</h2>
              <p className="text-xs text-gray-400 font-medium mt-1.5">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          {/* ====== EXACT FIGMA FILTER & SEARCH WHITE CONTAINER BOX ====== */}
          <div className="bg-white rounded-2xl md:rounded-[24px] border border-gray-200/70 p-3 md:p-[18px] flex flex-row items-center justify-between gap-3 md:gap-4 mb-4 md:mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <button className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <Filter size={16} strokeWidth={2.2} className="text-gray-400" /> 
              <span>Filter By</span>
            </button>
            
            <div className="relative w-full max-w-[420px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 md:w-[18px] md:h-[18px]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Assignment"
                className="w-full rounded-xl md:rounded-full bg-white border border-gray-200 px-4 py-2 md:py-2.5 pl-9 md:pl-11 text-xs md:text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <SkeletonGrid />
          ) : (
            /* Main Assignment Cards Workspace Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
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

          {/* ====== CENTERED FLOATING CREATE CTA BUTTON ====== */}
          <div className="fixed bottom-24 right-5 md:bottom-6 md:left-0 md:right-0 flex md:justify-center pointer-events-none z-40">
            {/* Mobile Plus Circle FAB */}
            <Link
              href="/create"
              className="md:hidden pointer-events-auto h-12 w-12 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100 active:scale-95 transition-transform"
            >
              <Plus size={22} className="text-[#FF5A36]" strokeWidth={2.5} />
            </Link>

            {/* Desktop Action Rounded Text Pill */}
            <Link
              href="/create"
              className="hidden md:flex pointer-events-auto bg-[#141414] hover:bg-black text-xs font-bold text-white rounded-full px-5 py-3.5 shadow-xl items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={14} strokeWidth={3} /> Create Assignment
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
    <div className="relative bg-white rounded-2xl md:rounded-[28px] border border-gray-200/60 p-5 md:p-7 shadow-[0_2px_4px_rgba(0,0,0,0.005)] transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-[16px] md:text-xl text-[#141414] tracking-tight line-clamp-2">
          {a.title}
        </h3>
        <div className="relative z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleMenu();
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <MoreVertical size={18} strokeWidth={2.5} />
          </button>
          {open && (
            <div className="absolute right-0 top-9 w-44 rounded-xl border border-gray-100 bg-white py-1.5 z-30 shadow-xl">
              <Link
                href={`/result/${a._id}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} className="text-gray-400" /> View Assignment
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Row Metadata Layout matching exact metrics */}
      <div className="mt-6 md:mt-8 flex flex-row items-center justify-between text-[11px] md:text-xs text-gray-400 font-medium tracking-tight gap-1">
        <span className="whitespace-nowrap">
          Assigned on : <span className="text-gray-500 font-semibold ml-0.5">{created}</span>
        </span>
        <span className="whitespace-nowrap">
          Due : <span className="text-gray-500 font-semibold ml-0.5">{due}</span>
        </span>
      </div>
      
      <Link
        href={`/result/${a._id}`}
        className="absolute inset-0 rounded-2xl md:rounded-[28px] z-0"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 md:p-7 bg-white rounded-2xl md:rounded-[28px] border border-gray-100 animate-pulse">
          <div className="h-5 w-2/3 bg-gray-100 rounded" />
          <div className="mt-8 flex justify-between">
            <div className="h-3 w-28 bg-gray-100 rounded" />
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