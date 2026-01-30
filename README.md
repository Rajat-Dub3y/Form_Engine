**Project Overview**

A schema-driven React + TypeScript form engine with nested schemas, repeaters, conditional logic, sync + async validation, autosave/resume with conflict handling, and Storybook demonstrations.

**Tech Stack**

- **Core:** React (>=18, repo uses React 19), TypeScript (strict mode enabled), Vite
- **Testing:** Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- **Storybook:** Storybook (configured under .storybook)

**What’s implemented**

- Nested schemas & repeaters
- Conditional visibility and dependency resolution
- Sync + async validation pipeline (field-level async validators supported)
- Autosave to `localStorage` with simple conflict detection (accept remote / keep local)
- Accessibility improvements: ARIA attributes, keyboard-first scenarios, and keyboard tests
- Unit tests covering keyboard navigation, async validation, and hidden-field validation

**Compliance status (GLOBAL CONSTRAINTS)**

- **React 18+**: ✅ repo uses React 19
- **TypeScript strict mode**: ✅ `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` enabled ([tsconfig.app.json](tsconfig.app.json#L1-L40))
- **Vite**: ✅ configured and used in npm scripts
- **Tailwind CSS (MANDATORY)**: ❌ Not installed/configured. This is a blocking item for full compliance.
- **Storybook**: ✅ configured (`.storybook`) and stories present (`src/stories`)
- **Chromatic**: ⚠ Script exists in `package.json` but public Storybook publish needs verification and a valid Chromatic token to succeed
- **ESLint + TypeScript ESLint**: ⚠ `eslint` present; recommend adding `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` for full TS linting
- **Prettier**: ❌ `prettier` not in devDependencies (format script exists but Prettier is missing)
- **Testing Library**: ✅ present and tests run locally
- **@storybook/addon-a11y / axe**: ✅ `@storybook/addon-a11y` present; automated axe checks are not yet added to the Vitest suite

**Quick local setup**

Prerequisites: Node 18+ (or your chosen supported Node for Vite)

Install:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run unit tests (watch):

```bash
npm test
```

Run unit tests (single run):

```bash
npm run test:run
```

Run Storybook locally:

```bash
npm run storybook
```

Build Storybook:

```bash
npm run build-storybook
```

Publish to Chromatic (requires CHROMATIC_PROJECT_TOKEN env var or configured token):

```bash
npm run chromatic
```

Type-check (no emit):

```bash
npx tsc --noEmit
```

**Notes & next steps (recommended)**

1. Add Tailwind CSS and design-token setup (blocking for GLOBAL CONSTRAINTS):

	- Install: `npm install -D tailwindcss postcss autoprefixer`
	- Init config: `npx tailwindcss init -p`
	- Add Tailwind directives to your main CSS and convert component styles to utility classes + CSS variables for design tokens.

2. Add Prettier and format rules: `npm install -D prettier` and create `.prettierrc`.

3. Install proper TypeScript ESLint packages:

	```bash
	npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
	```

4. Add automated a11y checks (axe) to tests and add `high-contrast` and `loading` stories in Storybook.

5. Verify Chromatic publish (ensure project token and public Storybook access).

**Where to look**

- Source for the form engine: `src/form_engine`
- Stories: `src/stories` (see `FormBuilder.stories.tsx`)
- Tests: `src/tests` (see `FormBuilder.test.tsx`)

If you want, I can implement the Tailwind integration and add a `high-contrast` story next — which would unblock full compliance. 

