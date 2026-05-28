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
    <div className="rounded-[30px] border border-[#E3E5EE] bg-[#F3F4F8] px-4 py-3 shadow-sm md:px-5 md:py-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 border border-[#E3E5EE] shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <h1 className="flex-1 text-center text-base font-semibold text-slate-900">
          {title}
        </h1>

        <div className="w-11" />
      </div>
    </div>
  );
}
