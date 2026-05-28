import type { Difficulty } from '@/lib/api';

export function DifficultyBadge({ d }: { d: Difficulty }) {
  if (d === 'easy') return <span className="chip-easy">Easy</span>;
  if (d === 'hard') return <span className="chip-hard">Hard</span>;
  return <span className="chip-mod">Moderate</span>;
}
