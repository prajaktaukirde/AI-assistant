import { Sidebar } from './Sidebar';

interface Props {
  children: React.ReactNode;
  assignmentsCount?: number;
  libraryCount?: number;
  topButton?: 'create' | 'toolkit';
}

export function AppShell({
  children,
  assignmentsCount,
  libraryCount,
  topButton,
}: Props) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1440px] p-4 flex gap-5">
        <Sidebar
          assignmentsCount={assignmentsCount}
          libraryCount={libraryCount}
          topButton={topButton}
        />
        <main className="flex-1 min-w-0 space-y-4">{children}</main>
      </div>
    </div>
  );
}
