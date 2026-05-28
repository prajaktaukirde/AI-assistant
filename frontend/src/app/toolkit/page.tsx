import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { BookOpen } from 'lucide-react';

export default function ToolkitPage() {
  return (
    <AppShell topButton="toolkit">
      <Topbar title="AI Teacher's Toolkit" icon={<BookOpen size={18} />} />
      <div className="card grid place-items-center py-24 text-center">
        <h2 className="text-lg font-semibold">AI Teacher&apos;s Toolkit</h2>
        <p className="mt-1 text-sm text-gray-500">Coming soon.</p>
      </div>
    </AppShell>
  );
}
