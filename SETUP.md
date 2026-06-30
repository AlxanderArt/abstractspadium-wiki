# Abstractspadium Wiki Setup

## Prerequisites

- Node.js 18.18+; Node 20 or 22 preferred
- npm
- Git
- GitHub CLI (`gh`) for repository setup
- Vercel CLI (`npx vercel@latest`) for deployment

## Local development

```bash
cd abstractspadium-wiki-site
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Production build

```bash
npm run build
npm run start
```

The build must pass before pushing or deploying.

## Replacing or refreshing wiki content

The source wiki can be mirrored from:

```text
/root/abstractspadium-wiki
```

From the project root:

```bash
rm -rf content/wiki/concepts content/wiki/entities content/wiki/places content/wiki/factions content/wiki/questions content/wiki/sources
cp -R /root/abstractspadium-wiki/concepts content/wiki/
cp -R /root/abstractspadium-wiki/entities content/wiki/
cp -R /root/abstractspadium-wiki/places content/wiki/
cp -R /root/abstractspadium-wiki/factions content/wiki/
cp -R /root/abstractspadium-wiki/questions content/wiki/
cp -R /root/abstractspadium-wiki/sources content/wiki/
cp /root/abstractspadium-wiki/index.md content/wiki/index.md
cp /root/abstractspadium-wiki/SCHEMA.md content/wiki/schema.md
cp /root/abstractspadium-wiki/production/abstractspadium-codex-formatted.pdf public/downloads/abstractspadium-codex-formatted.pdf
npm run build
```

## GitHub

Recommended repository:

```text
AlxanderArt/abstractspadium-wiki
```

Create/push:

```bash
git init
git branch -M main
git add .
git commit -m "Create Abstractspadium wiki website"
gh repo create AlxanderArt/abstractspadium-wiki --public --source . --remote origin --push
```

## Vercel

Deploy:

```bash
npx vercel@latest --yes --prod --project abstractspadium-wiki
```

If linking is required:

```bash
npx vercel@latest link --yes --project abstractspadium-wiki
npx vercel@latest --yes --prod --project abstractspadium-wiki
```

## Security

Do not commit:

- `.env*`
- `.vercel/`
- `node_modules/`
- `.next/`
- tokens
- OAuth artifacts
- credential files

Use Computer Use / browser device login for GitHub or Vercel UI authentication. Never print tokens, cookies, auth headers, or credential JSON.

## Verification checklist

- `npm run build` passes
- `/` returns 200
- `/wiki` returns 200
- `/wiki/abstractspadium` returns 200
- `/wiki/grey` returns 200
- `/wiki/the-unique` returns 200
- `/wiki/vyori` returns 200
- `/wiki/places` returns 200
- `/downloads/abstractspadium-codex-formatted.pdf` returns 200
- sidebar navigation renders
- internal wikilinks are clickable
- status badges render
- Three.js background is subtle and non-blocking
- GSAP loading/page-entry animations run
- reduced-motion fallback exists
- GitHub README and About/Homepage contain the live URL
