# Abstractspadium Wiki

**Live Website:** [Abstractspadium Wiki](https://abstractspadium-wiki.vercel.app)

A space drawn away from physical reality — where concepts, meaning, and will become terrain.

The living codex of Abstractspadium, rendered from Markdown into a custom dark wiki website.

## Stack

Next.js App Router · TypeScript · Markdown (`gray-matter` + `remark`) · Three.js / React Three Fiber · GSAP · Vercel

## Features

- Custom dark codex visual style
- Markdown-powered wiki pages
- Obsidian-style `[[wikilinks]]` and `[[slug|Label]]` conversion
- Sidebar navigation grouped by lore category
- Canon/status badges
- Search/filter box
- Three.js atmospheric background layer
- GSAP loading and page-entry animations
- Reduced-motion fallback
- Bundled formatted codex PDF

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Content

Wiki pages live in `content/wiki/`.

Add a `.md` file with frontmatter such as:

```yaml
---
title: Grey
type: entity
status: working-canon
tags: [grey, abstractspadium]
sources: [raw/notes/abstractspadium-clean-source-2026-06-30.md]
---
```

The file stem becomes the slug:

```text
entities/grey.md → /wiki/grey
```

Obsidian `[[wikilinks]]` and `[[slug|Label]]` resolve to internal links.

## Formatted codex

A typeset PDF is bundled at:

```text
public/downloads/abstractspadium-codex-formatted.pdf
```
