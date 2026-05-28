'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, BookOpen, PieChart, Bell, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';

interface Props {
  children: React.ReactNode;
  assignmentsCount?: number;
  libraryCount?: number;
  topButton?: 'create' | 'toolkit';
}

const MOBILE_NAV = [
  { label: 'Home', href: '/', icon: LayoutGrid },
  { label: 'Assignments', href: '/assignments', icon: FileText },
  { label: 'Library', href: '/library', icon: PieChart },
  { label: 'AI Toolkit', href: '/toolkit', icon: BookOpen },
];

export function AppShell({
  children,
  assignmentsCount,
  libraryCount,
  topButton,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F5F8] pb-32">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-4 md:flex-row md:px-6">
        <Sidebar
          assignmentsCount={assignmentsCount}
          libraryCount={libraryCount}
          topButton={topButton}
        />
        <main className="flex-1 min-w-0 space-y-4 w-full md:max-w-none md:mx-0">
          <div className="mx-auto w-full max-w-[720px] md:max-w-none">
            <div className="mb-4 md:hidden">
              <div className="rounded-[30px] border border-[#E3E5EE] bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-3xl bg-[#0F172A] text-white">
                      <Logo size={22} />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">VedaAI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="grid h-11 w-11 place-items-center rounded-full bg-[#F5F6FA] text-slate-700 border border-[#E3E5EE]">
                      <Bell size={18} />
                    </button>
                    <button className="grid h-11 w-11 place-items-center rounded-full bg-[#F5F6FA] text-slate-700 border border-[#E3E5EE]">
                      <span className="h-9 w-9 rounded-full bg-[#1F2937] text-white grid place-items-center">U</span>
                    </button>
                    <button className="grid h-11 w-11 place-items-center rounded-full bg-[#F5F6FA] text-slate-700 border border-[#E3E5EE]">
                      <Menu size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none md:hidden">
        <div className="mx-auto flex max-w-[640px] items-center justify-center px-4">
          <div className="pointer-events-auto flex w-full max-w-[548px] items-center justify-between rounded-[40px] bg-[#0f0f11] px-4 py-3 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.55)]">
            {MOBILE_NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col items-center gap-1 text-[11px] ${
                    active ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-[24px] ${
                    active ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}>
                    <Icon size={18} />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
