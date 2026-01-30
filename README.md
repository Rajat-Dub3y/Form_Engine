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


```


**Where to look**

- Source for the form engine: `src/form_engine`
- Stories: `src/stories` (see `FormBuilder.stories.tsx`)
- Tests: `src/tests` (see `FormBuilder.test.tsx`)

If you want, I can implement the Tailwind integration and add a `high-contrast` story next — which would unblock full compliance. 

