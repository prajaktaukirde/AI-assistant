'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, FolderPlus, Sparkles, Bell, Menu, Plus } from 'lucide-react';

// --- Types & Interfaces ---
interface AppShellProps {
  children: React.ReactNode;
  assignmentsCount?: number;
  libraryCount?: number;
  topButton?: 'create' | 'toolkit';
}

// --- Navigation Links Data ---
const MOBILE_NAV = [
  { label: 'Home', href: '/', icon: LayoutGrid },
  { label: 'Assignments', href: '/assignments', icon: FileText },
  { label: 'Library', href: '/library', icon: FolderPlus }, 
  { label: 'AI Toolkit', href: '/toolkit', icon: Sparkles },
];

// --- Mock Logo Component to prevent build errors ---
function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

// ==========================================
// 1. MAIN APP SHELL COMPONENT
// ==========================================
export function AppShell({
  children,
  assignmentsCount,
  libraryCount,
  topButton,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F5F8] pb-36 font-sans">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-4 md:flex-row md:px-6">
        
        {/* Placeholder Sidebar for Desktop Viewports */}
        <aside className="hidden md:flex w-64 flex-col gap-4">
          <div className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#141414] text-white">
                <Logo size={18} />
              </span>
              <span className="text-base font-bold text-[#141414]">VedaAI</span>
            </div>
            <nav className="flex flex-col gap-1">
              {MOBILE_NAV.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    pathname === item.href ? 'bg-gray-100 text-slate-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full md:max-w-none md:mx-0">
          <div className="mx-auto w-full max-w-[720px] md:max-w-none">
            
            {/* Top Sticky/Floating Mobile Header */}
            <div className="mb-4 md:hidden">
              <div className="rounded-[24px] border border-gray-200/60 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  
                  {/* Brand Brand Signature */}
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#141414] text-white">
                      <Logo size={18} />
                    </span>
                    <span className="text-base font-bold text-[#141414] tracking-tight">VedaAI</span>
                  </div>
                  
                  {/* Action Navigation Item Row */}
                  <div className="flex items-center gap-2">
                    {/* Notification Anchor */}
                    <button className="relative grid h-10 w-10 place-items-center rounded-full bg-[#F5F6FA] border border-gray-100">
                      <Bell size={18} className="text-[#141414]" />
                      <span className="absolute top-[11px] right-[11px] h-2 w-2 rounded-full bg-[#FF5B22]" />
                    </button>
                    
                    {/* User Profile Avatar Frame */}
                    <button className="h-10 w-10 overflow-hidden rounded-full bg-[#F5F6FA] border border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                        alt="User Profile Dashboard Avatar" 
                        className="h-full w-full object-cover"
                      />
                    </button>
                    
                    {/* Context Drawer Panel Menu Toggle Trigger */}
                    <button className="grid h-10 w-10 place-items-center bg-transparent active:opacity-60 transition-opacity">
                      <Menu size={22} className="text-[#141414]" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Layout Content Mount Inject Point */}
            {children}

          </div>
        </main>
      </div>

      {/* Floating Bottom Navigation Tab bar - Mobile Adaptive Interface Viewports */}
      <nav className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none md:hidden">
        <div className="mx-auto flex items-center justify-center px-6">
          <div className="pointer-events-auto flex w-full max-w-[360px] items-center justify-between rounded-[28px] bg-[#141414] px-4 py-2.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]">
            {MOBILE_NAV.map((item) => {
              const Icon = item.icon;
              // Evaluates current active page safely to reflect selection styling
              const active = pathname === item.href || (item.label === 'Assignments' && (pathname === '/assignments' || pathname === '' || !pathname));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-200 ${
                    active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="grid h-7 w-7 place-items-center">
                    <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                  </span>
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}


// ==========================================
// 2. EMPTY ASSIGNMENTS STATE COMPONENT
// ==========================================
export function EmptyAssignments() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[68vh] w-full px-4 py-6 bg-transparent">
      <div className="flex flex-col items-center max-w-sm w-full">
        
        {/* Isolated Vectors Canvas Container */}
        <EmptyArt />
        
        <h2 className="mt-8 text-[22px] font-bold text-[#141414] tracking-tight">
          No assignments yet
        </h2>
        
        <p className="mt-2.5 text-sm text-gray-500 leading-relaxed px-4 font-normal">
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let
          AI assist with grading.
        </p>
        
        {/* Core Primary Custom CTA Button Action */}
        <Link
          href="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#141414] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 active:scale-95 transition-transform duration-150"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Your First Assignment
        </Link>
      </div>
    </div>
  );
}


// ==========================================
// 3. INTERNAL SVG LAYOUT ILLUSTRATION COMPONENT
// ==========================================
function EmptyArt() {
  return (
    <div className="relative mx-auto w-[240px] h-[240px] select-none pointer-events-none sm:w-[260px] sm:h-[260px]">
      
      {/* Background Radial Drop Shadow Glow Circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #f1f1f4 0%, #ececef 60%, transparent 75%)',
        }}
      />

      {/* Decorative Floating Confetti Accent Glyphs */}
      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 w-full h-full z-10"
        fill="none"
      >
        {/* Curled Top Left String Loop */}
        <path
          d="M55 60 C 90 30, 110 60, 100 80"
          stroke="#1f2937"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Sparkle Node Elements */}
        <circle cx="195" cy="170" r="3" fill="#3b82f6" />
        <circle cx="60" cy="190" r="3" fill="#fbbf24" />
        {/* Tiny Cross Cluster Spark */}
        <path d="M85 145 L 80 152 M 90 142 L 95 138" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Centered Assignment Document Preview Sheet */}
      <div className="absolute inset-0 grid place-items-center z-20">
        <div
          className="relative w-[130px] h-[160px] rounded-2xl bg-white border border-gray-100 px-4 pt-5 flex flex-col gap-2.5 shadow-md"
          style={{ boxShadow: '0 12px 36px -12px rgba(15,23,42,0.12)' }}
        >
          {/* Main Simulated Header Text Rule */}
          <div className="h-2 w-12 rounded bg-[#141414]" />
          
          {/* Alternating Simulated Content Line Blocks */}
          <div className="h-1.5 w-20 rounded bg-gray-200/80" />
          <div className="h-1.5 w-16 rounded bg-gray-200/80" />
          <div className="h-1.5 w-22 rounded bg-gray-200/80" />
          <div className="h-1.5 w-14 rounded bg-gray-200/80" />
          <div className="h-1.5 w-18 rounded bg-gray-200/80" />

          {/* Secondary Independent Top Floating Info Pill Block Layout */}
          <div className="absolute -top-1 -right-4 rounded-lg bg-white border border-gray-100 px-2 py-1.5 shadow-sm">
            <div className="h-1.5 w-6 rounded bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Loupe / Magnifying Lens Overlay Glass Frame with Failure State Badge Indicator Cross */}
      <svg
        viewBox="0 0 100 100"
        className="absolute z-30"
        style={{
          width: 120,
          height: 120,
          right: 2,
          bottom: 12,
        }}
      >
        {/* Optical Viewing Lens Ring */}
        <circle
          cx="42"
          cy="42"
          r="30"
          fill="white"
          stroke="#e2e4ed"
          strokeWidth="5"
        />
        {/* Solid Metal Diagonally Aligned Base Handle Structural Extension */}
        <line
          x1="63"
          y1="63"
          x2="90"
          y2="92"
          stroke="#d2d5e3"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Centered High Precision Error State Red 'X' Structural Markings */}
        <path
          d="M32 32 L 52 52 M 52 32 L 32 52"
          stroke="#ff4d4d"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}