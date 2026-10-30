import type { StatusKind } from '../components/ui';

export const ROADMAP_STAGES = [
  { id: 'foundation', status: 'planned' },
  { id: 'collaboration', status: 'planned' },
  { id: 'intelligence', status: 'planned' },
  { id: 'platform', status: 'planned' },
  { id: 'teams', status: 'futureVision' },
] as const satisfies readonly { id: string; status: StatusKind }[];

export type RoadmapStageId = (typeof ROADMAP_STAGES)[number]['id'];
