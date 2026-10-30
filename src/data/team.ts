export const TEAM_HANDLES = ['@joda', '@deishan', '@smile', '@ded', '@luis'] as const;

export type TeamHandle = (typeof TEAM_HANDLES)[number];

export const TEAM_MARKS: Record<TeamHandle, string> = {
  '@joda': 'JO',
  '@deishan': 'DI',
  '@smile': 'SM',
  '@ded': 'DD',
  '@luis': 'LU',
};
