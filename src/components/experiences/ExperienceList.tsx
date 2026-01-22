'use client';

import type { Experience } from '@/types/database';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceListProps {
  experiences: Experience[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
}

export function ExperienceList({
  experiences,
  selectable = false,
  selectedIds,
  onToggle,
}: ExperienceListProps) {
  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          selectable={selectable}
          selected={selectedIds?.has(experience.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
