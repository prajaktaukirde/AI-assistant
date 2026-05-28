'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, BookOpen, Sparkles, Bell, Menu, Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';

interface Props {
  children: React.ReactNode;
  assignmentsCount?: number;
  libraryCount?: number;
  topButton?: 'create' | 'toolkit';
}

const MOBILE_NAV = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Assignments', href: '/assignments', icon: Layers },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'AI Toolkit', href: '/toolkit', icon: Sparkles },
];

export function AppShell({
  children,
  assignmentsCount,
  libraryCount,
  topButton,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F5F8] pb-24 md:pb-32">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-4 md:flex-row md:px-6">
        <Sidebar
          assignmentsCount={assignmentsCount}
          libraryCount={libraryCount}
          topButton={topButton}
        />
        <main className="flex-1 min-w-0 space-y-4 w-full md:max-w-none md:mx-0">
          <div className="mx-auto w-full max-w-[720px] md:max-w-none">
            {/* ====== MOBILE HEADER PILL BAR ====== */}
            <div className="mb-4 md:hidden">
              <div className="rounded-[24px] border border-[#E3E5EE] bg-white px-4 py-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#0F172A] text-white">
                      <Logo size={18} />
                    </span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">VedaAI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="relative grid h-9 w-9 place-items-center rounded-full bg-[#F5F6FA] text-slate-700 border border-[#E3E5EE]">
                      <Bell size={16} />
                      <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-[#FA5A16]" />
                    </button>
                    <button className="grid h-9 w-9 place-items-center rounded-full overflow-hidden bg-gray-200 border border-[#E3E5EE]">
                      <span className="h-full w-full bg-[#1F2937] text-white text-[11px] font-bold grid place-items-center">U</span>
                    </button>
                    <button className="grid h-9 w-9 place-items-center rounded-full bg-[#F5F6FA] text-slate-700 border border-[#E3E5EE]">
                      <Menu size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {children}
          </div>
        </main>
      </div>

      {/* ====== FIXED MOBILE FLOATING PLUS ACTION ACCELERATOR BUTTON ====== */}
      <div className="md:hidden fixed right-6 bottom-24 z-50">
        <Link
          href="/create"
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-orange-500 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-transform active:scale-95"
        >
          <Plus size={24} strokeWidth={2.5} />
        </Link>
      </div>

      {/* ====== FIXED GLOBAL MOBILE BOTTOM DOCK ====== */}
      <nav className="fixed bottom-4 left-4 right-4 z-40 pointer-events-none md:hidden">
        <div className="mx-auto flex max-w-[500px] items-center justify-center">
          <div className="pointer-events-auto flex w-full items-center justify-around rounded-[24px] bg-[#141414] px-2 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
            {MOBILE_NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1.5 text-[10px] w-20 transition-colors ${
                    active ? 'text-white font-semibold' : 'text-gray-500 font-medium'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? 'text-white' : 'text-gray-500'} />
                  <span className="tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}