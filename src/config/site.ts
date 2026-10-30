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

export const betaRelease = {
  version: '1.143.1-beta.4',
  fileName: 'DualcodeSetup-x64-1.143.1-beta.4.exe',
  sha256: '9c98aed2851851f0496ffd5efd531760c1bdd167f45439d8813b9a20427ac1cc',
  downloadUrl: 'https://github.com/Valgan21/DualCode/releases/download/beta.4/DualcodeSetup-x64-1.143.1-beta.4.exe',
  releasesUrl: 'https://github.com/Valgan21/DualCode/releases/tag/beta.4',
} as const;

export const siteConfig = {
  name: 'DualCode',
  siteUrl: clean(import.meta.env.VITE_SITE_URL).replace(/\/$/, ''),
  discordUrl: httpsOnly(clean(import.meta.env.VITE_DISCORD_INVITE_URL)) || OFFICIAL_DISCORD_URL,
  githubUrl: httpsOnly(clean(import.meta.env.VITE_GITHUB_URL)),
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
} as const;
