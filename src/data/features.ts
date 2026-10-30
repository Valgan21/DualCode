import type { StatusKind } from '../components/ui';

export type FeatureId =
  | 'editor'
  | 'agentSessions'
  | 'orchestration'
  | 'history'
  | 'terminal'
  | 'memory'
  | 'visualBrain'
  | 'dualQuantum'
  | 'teams'
  | 'enterprise';

// Provisional: the team has not confirmed these. Nothing is 'available' until a verified build exists.
export const FEATURES: { id: FeatureId; status: Extract<StatusKind, 'available' | 'experimental' | 'planned' | 'futureVision'> }[] = [
  { id: 'editor', status: 'planned' },
  { id: 'agentSessions', status: 'planned' },
  { id: 'orchestration', status: 'planned' },
  { id: 'history', status: 'planned' },
  { id: 'terminal', status: 'planned' },
  { id: 'memory', status: 'planned' },
  { id: 'visualBrain', status: 'planned' },
  { id: 'dualQuantum', status: 'planned' },
  { id: 'teams', status: 'planned' },
  { id: 'enterprise', status: 'futureVision' },
];
