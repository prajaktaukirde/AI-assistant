import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { PieChart } from 'lucide-react';

export default function LibraryPage() {
  return (
    <AppShell>
      <Topbar title="My Library" icon={<PieChart size={18} />} />
      <div className="card grid place-items-center py-24 text-center">
        <h2 className="text-lg font-semibold">My Library</h2>
        <p className="mt-1 text-sm text-gray-500">Coming soon.</p>
      </div>
    </AppShell>
  );
}
