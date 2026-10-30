# DualCode deployment

The site is ready to deploy as a Vite static site on Cloudflare Pages or Workers static assets.

The intended public repository is [Valgan21/DualCode](https://github.com/Valgan21/DualCode). Before connecting a hosting provider to GitHub, make sure this workspace's source files are committed and pushed to that repository.

## Cloudflare Pages settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: use the Node version supported by the repository's lockfile and current Cloudflare Pages build image

Do not commit a real `.env` file. Configure the following variables in the Cloudflare Pages project under the Preview and Production environments as appropriate:

```text
VITE_SITE_URL=https://<the-pages-hostname>
VITE_DISCORD_INVITE_URL=https://discord.gg/3AsRMPvQT3
VITE_GITHUB_URL=
VITE_CONTACT_EMAIL=
```

`VITE_SITE_URL` is intentionally empty in `.env.example`. When it is not set, the build does not generate a sitemap and the client does not publish a guessed canonical or Open Graph origin. Once the final `.pages.dev` hostname is known, set it without a trailing slash and rebuild. The build will then generate `dist/sitemap.xml` with the localized URLs and `hreflang` alternates.

The official Discord invite is already the safe default in the application. Keep `VITE_DISCORD_INVITE_URL` empty if the default should be used.

## Local release checks

Run these from the project root before publishing:

```powershell
npm ci
npm run build
npm run test:e2e
```

Playwright starts a temporary production preview automatically, so the E2E command is sufficient:

```powershell
npm run test:e2e
```

The final command should report 136 passing tests on the current suite.

## After the first deployment

Check the deployed EN and ES home routes, one internal route, the 404 route, the mobile menu, the Preview interactions, and the Discord links. Also inspect the browser console once under the Cloudflare headers; the dashboard progress bar uses a CSSOM-applied transform and should remain free of CSP errors.

The public domain is still a deployment decision. Until it is configured, the UI can be previewed on the generated `.pages.dev` hostname, while absolute sitemap, canonical, and Open Graph URLs remain intentionally disabled.

## Worker deployment note

If the deployment URL ends in `.workers.dev`, deploy from the project root with Wrangler so `wrangler.toml` is applied. Its `assets.not_found_handling = "single-page-application"` setting is required for `/en/`, `/es/`, and other client-side routes to serve `index.html`. A root-only Worker deployment can return `404` for those routes even when `/` works.

```powershell
npm run build
npx wrangler deploy
```

For a Pages project ending in `.pages.dev`, run `npm run build:pages` and upload the contents of `dist`. That command adds the Pages-compatible `/* /index.html 200` `_redirects` rule only to the upload artifact. The repository intentionally does not ship that rule in `public/`: Wrangler rejects it as an infinite loop when deploying the Worker, whose SPA fallback is provided by `wrangler.toml` instead.
