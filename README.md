# A birthday greeting for Anastasia

A mobile-first static greeting with illustrated screens, three gifts to open, a personal letter and a video. Built with Vite, TypeScript, CSS and SVG. Fonts and media are included locally.

## Publish to GitHub Pages

1. Create a public GitHub repository and push this project's source files to its `main` branch.
2. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Deploy to GitHub Pages**. The workflow builds and publishes the site on every push to `main`. If the first run happened before Pages was enabled, select **Run workflow** to retry.
4. The deployed URL appears in the workflow result and in **Settings → Pages**. A project repository uses `https://<username>.github.io/<repository>/`.

Commit `src/`, `public/`, the configuration files, `.github/workflows/deploy.yml`, `package.json` and `package-lock.json`. Do not commit `node_modules/`, `dist/`, screenshots, test reports, archives or local environment files: `.gitignore` excludes them. The workflow uploads only the generated `dist/` directory to Pages; tests and source files are not part of the published build.

`vite.config.ts` uses relative asset paths, so the repository name does not need to be configured. The prepared MP4 and its poster in `public/media/` must remain in Git: the site uses them directly. No external hosting account or deployment secret is needed.

Reference: [Vite's GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages).

## Local development

Use Node.js 24 LTS (the version used by the deployment workflow) or a compatible later version.

```sh
npm ci
npm run dev
```

To verify the production build:

```sh
npm run build
npm run preview
```

To run browser checks:

```sh
npx playwright install chromium
npm test
```

## Content

- `src/letter.ts`: the complete greeting. Confirm the supplied relative date before sharing.
- `src/art.ts`: SVG illustrations.
- `public/media/`: the supplied video remuxed to MP4 without re-encoding and its poster.
- `src/state.ts`: lottery state saved in the visitor's browser. Opened gifts survive reloads on the same site and browser; other devices or cleared browser data start fresh.

For local testing, remove `anastasia-birthday:v1` from browser local storage and reload to reset the lottery. There is no reset button for visitors.
