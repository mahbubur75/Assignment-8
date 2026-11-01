<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Assignment-8 (Next.js 16 App)

## Stack

- Next.js 16.4.3 (App Router, `src/` directory layout), React 19.3, TypeScript strict. npm is the package manager.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`): don't add `useMemo`/`useCallback`/`memo` for optimization; keep components Rules-of-React-clean and let the compiler memoize.
- README is untouched create-next-app boilerplate — not repo-specific documentation.

## Commands

- `npm run dev` — dev server (Turbopack). `npm run build` / `npm start`. `npm run lint` runs ESLint 9 flat config.
- No test setup exists. There is no typecheck script; use `npx tsc --noEmit` (requires a prior `next build` or `next dev` run, since `tsconfig.json` includes generated types in `.next/types` and `.next/dev/types`).
- Add shadcn UI components with `npx shadcn add <component>` rather than hand-writing them. Existing UI lives in `src/components/ui`.

## Cache Components & async route props (the big Next 16 gotcha)

- `cacheComponents: true` and `partialPrefetching: true` are set at the top level of `next.config.ts` (not `experimental`). PPR is the only rendering model, so caching/prerender errors differ from pre-16 Next.js; consult the bundled docs when a build fails on prerender access.
- `params` and `searchParams` are Promises — `await` them (or unwrap with React `use`).
- Route props are typed with the global helpers `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/route'>`; they are globally available, no import needed (see `src/app/layout.tsx` using `LayoutProps<"/">`).

## Styling & UI

- Tailwind v4, CSS-first: there is no `tailwind.config.*`. Tailwind is wired through Turbopack (`turbopack.rules` in `next.config.ts`) and all design tokens/theme mappings live in `src/app/globals.css` (`@theme inline`, CSS variables). Edit tokens there, not in a config file.
- Dark mode is class-based: `@custom-variant dark` matches `.dark *` — toggle by putting `.dark` on `<html>`.
- shadcn uses the `base-nova` style: primitives are `@base-ui/react/*` components, **not** Radix (`@base-ui/react` is a real dependency). `cn` is imported from the `cn` package (see `src/components/ui/button.tsx`). Icons: `lucide-react`.
- Path alias: `@/*` → `./src/*` (tsconfig paths; `components.json` aliases match).

## Repo state

- Single commit, fresh create-next-app scaffold. `src/app/page.tsx` was deliberately emptied to a bare `<div>` — treat it as the user's blank canvas; don't reintroduce create-next-app sample markup.
