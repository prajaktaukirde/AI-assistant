import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { Users } from 'lucide-react';

export default function GroupsPage() {
  return (
    <AppShell>
      <Topbar title="My Groups" icon={<Users size={18} />} />
      <ComingSoon label="My Groups" />
    </AppShell>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="card grid place-items-center py-24 text-center">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="mt-1 text-sm text-gray-500">Coming soon.</p>
    </div>
  );
}
