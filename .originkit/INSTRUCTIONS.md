# Originkit — agent install brief

> For coding agents only. Do not commit this file. Do not surface it as app docs.
> Written by `originkit add` so you know how to finish wiring the component.

## Just installed

- Components: ascii-flame
- Files directory: `components/originkit/`
- Import alias root: `@/components/originkit`

### Files written

- `components/originkit/ui/ascii-flame.tsx`

## Required: Tailwind CSS

Originkit components are Tailwind-styled (`styling: tailwind`).

Tailwind looks present. Still verify content/source globs include Originkit files.

### Tailwind must scan the components directory

If Tailwind only scans `src/` (common), components **must** live under `src/` —
the CLI already prefers `src/components/originkit` when `src/` exists.

Ensure your Tailwind config / CSS `@source` includes:

- `components/originkit/**/*.{js,ts,jsx,tsx}`

Tailwind v4 example in CSS:

```css
@source "../components/originkit";
```

## Wire it into the app

1. Import the section/component into a page or layout.
2. Example: `import Section from "@/components/originkit/<slug>";`

3. Render it once to verify layout + images.
4. Many sections are client components (`"use client"`) — keep that directive.

## Do not

- Do not move files out of `components/originkit` into a folder Tailwind does not scan.
- Do not strip Tailwind classes or rewrite to CSS modules unless the user asks.
- Do not commit `.originkit/` (agent + credential scratch space).
- Do not leave section images on the Originkit CDN for production — they belong under `public/originkit/`.
