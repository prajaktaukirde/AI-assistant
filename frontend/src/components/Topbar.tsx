'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';

interface Props {
  title?: string;
  icon?: React.ReactNode;
  showBack?: boolean;
}

export function Topbar({
  title = 'Assignment',
  icon,
  showBack = true,
}: Props) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-3xl border border-gray-100 px-5 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100 text-ink-900 border border-gray-100"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span className="grid h-7 w-7 place-items-center text-gray-500">
          {icon || <LayoutGrid size={18} />}
        </span>
        <h1 className="text-base sm:text-[17px] font-medium text-gray-700 truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-50 cursor-pointer">
          <div
            className="grid h-9 w-9 place-items-center rounded-full text-base shrink-0"
            style={{ background: '#fdeee5' }}
          >
            🧑‍🏫
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-ink-900">
            John Doe
          </span>
          <ChevronDown size={14} className="hidden sm:block text-gray-500" />
        </div>
      </div>
    </div>
  );
}