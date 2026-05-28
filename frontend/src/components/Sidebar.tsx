'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  PieChart,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Logo } from './Logo';

const NAV = [
  { label: 'Home', href: '/', icon: LayoutGrid },
  { label: 'My Groups', href: '/groups', icon: Users },
  { label: 'Assignments', href: '/assignments', icon: FileText, badge: true },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: BookOpen },
  { label: 'My Library', href: '/library', icon: PieChart },
];

interface Props {
  assignmentsCount?: number;
  libraryCount?: number;
  topButton?: 'create' | 'toolkit';
}

export function Sidebar({
  assignmentsCount,
  libraryCount,
  topButton = 'create',
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex md:flex-col w-[300px] shrink-0 bg-white rounded-3xl border border-gray-100 p-6 sticky top-4 h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 px-1 pt-1">
        <Logo size={42} />
        <span className="text-xl font-bold tracking-tight">VedaAI</span>
      </div>

      <div className="mt-7 px-1">
        <button
          onClick={() =>
            router.push(topButton === 'create' ? '/create' : '/toolkit')
          }
          className="btn-ringed w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 text-white py-3.5 text-sm font-semibold hover:bg-black transition"
        >
          <Sparkles size={16} className="text-brand-300" />
          {topButton === 'create' ? 'Create Assignment' : "AI Teacher's Toolkit"}
        </button>
      </div>

      <nav className="mt-7 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const badgeCount =
            item.label === 'Assignments'
              ? assignmentsCount
              : item.label === 'My Library'
                ? libraryCount
                : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'nav-item-active' : 'nav-item'}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badgeCount && badgeCount > 0 ? (
                <span className="rounded-full bg-brand-500 text-white text-[11px] font-semibold px-2 py-0.5 min-w-[24px] text-center">
                  {badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-ink-900"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3 border border-rose-100"
          style={{ background: '#fdeee5' }}
        >
          <div
            className="grid h-11 w-11 place-items-center rounded-full text-xl shrink-0"
            style={{ background: '#f6c8a8' }}
          >
            🧑‍🏫
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-900 truncate">
              Delhi Public School
            </p>
            <p className="text-xs text-gray-600 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
