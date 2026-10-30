const clean = (v: string | undefined) => (v ?? '').trim();

const httpsOnly = (v: string): string => {
  if (!v) return '';
  try {
    const u = new URL(v);
    return u.protocol === 'https:' ? u.toString() : '';
  } catch {
    return '';
  }
};

// Official invite supplied by the owners; VITE_DISCORD_INVITE_URL overrides it per environment.
const OFFICIAL_DISCORD_URL = 'https://discord.gg/3AsRMPvQT3';

export const siteConfig = {
  name: 'DualCode',
  siteUrl: clean(import.meta.env.VITE_SITE_URL).replace(/\/$/, ''),
  discordUrl: httpsOnly(clean(import.meta.env.VITE_DISCORD_INVITE_URL)) || OFFICIAL_DISCORD_URL,
  githubUrl: httpsOnly(clean(import.meta.env.VITE_GITHUB_URL)),
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
} as const;
