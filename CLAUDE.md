---

title: TON Console — AI Project Guide
version: 1.0.0
last_verified: 2026-02-16
owners:

* <fill in: owner GitHub handle/email>
  ai_maintained: true

---

# 0) Purpose of this file

This file is a source of truth for AI assistants and developers:

* describes the project's architecture, conventions, and patterns;
* sets unambiguous do's and don'ts;
* contains **safe blocks for AI auto‑updates** without clutter.

> Rule #1: **For new CRUD/server data we use React Query.**

---

# 1) Project overview

**TON Console** is a web application for managing access to TON blockchain APIs:

* metrics and dashboards;
* API keys;
* webhooks;
* management of liteproxy servers.

**Out of scope:** no server-side rendering, no Redux, no manual caching on top of React Query.

---

# 2) Tech stack (quick reference)

| Area         | Choice / Version                                | Rules                             |
| ------------ | ----------------------------------------------- | --------------------------------- |
| Core         | React **19.2.0**, TypeScript **5.9.3** (strict) | **Only** functional components    |
| Build        | Vite **5.4.6**                                  | Code-splitting by routes/features |
| Server state | **@tanstack/react-query 5.90.5**                | Mandatory for CRUD/fetching       |
| UI           | Chakra UI **2.10.9**                            | Single theme/tokens               |
| Charts       | Recharts **3.0.0**                              | Time series, see §7               |
| Routing      | React Router DOM **6.28.0**                     | Pages are thin, composition only  |
| Quality      | ESLint **9.38.0**, Prettier **3.6.2**, Vitest   | Zero errors/warnings in CI        |

---

# 3) Architecture and folder structure

```
src/
├─ app/                  # entry, providers, routing
├─ pages/                # pages (compose features; no business logic)
│  └─ tonapi/
│     ├─ api-keys/
│     ├─ liteservers/
│     ├─ webhooks/
│     └─ pricing/
├─ features/             # features (grouped by domain)
│  └─ tonapi/
│     ├─ api-keys/       # {model/, ui/, index.ts}
│     │  ├─ model/
│     │  │  ├─ queries.ts        # React Query hooks (new standard)
│     │  │  └─ interfaces/       # domain types
│     │  └─ ui/                  # "dumb" UI components
│     ├─ webhooks/               # React Query
│     ├─ statistics/             # React Query
│     └─ liteproxy/              # React Query
├─ entities/             # domain models/entities (if shared)
├─ shared/
│  ├─ api/
│  │  └─ console/        # ⚙️ auto-generated from swagger.yaml
│  ├─ lib/               # utilities (Loadable — legacy)
│  ├─ ui/                # reusable UI components
│  ├─ config/            # app-level config (maintenance mode, etc.)
│  ├─ hooks/             # shared hooks (legacy helpers)
│  ├─ contexts/          # ProjectContext.tsx — selected project context
│  └─ queries/           # projects.ts — React Query for projects
└─ processes/            # side-effects initialization
```

**Principles**

* **Thin pages:** composition only.
* **Feature = isolated module:** `model/` (data/queries) + `ui/` (presentation).
* **Do not touch generated files manually** (see §6.2).

---

# 4) Code conventions

**TypeScript**

* strict mode required; **ABSOLUTELY NO `any` types** — this is a CRITICAL priority.
* **ABSOLUTELY NO Type Assertion (`as` keyword)** — even `as const` should be avoided unless absolutely necessary. Build proper types instead. This is EQUALLY CRITICAL as banning `any`.
  - ❌ BAD: `const data = response as unknown as MyType`
  - ❌ BAD: `status.map(s => s as InvoiceStatus)`
  - ✅ GOOD: Build type-safe objects with proper typing
  - ✅ GOOD: Use `Object.entries()` + proper type mapping instead of `as`
* Explicit types for public functions and after `map/filter/reduce`.
* Domain types in `features/<domain>/<feature>/model/interfaces`.

**Linting**

* Run `npm run lint:fix` to fix linting errors.
* Do **not use `// eslint-disable`** to disable linting errors.
* ESLint error should be fixed, instead of disabled

**Naming**

* Components: `PascalCase`. Hooks: `useXxx`.
* Feature folders: `kebab-case`. Files: no suffixes like `.component.tsx`.
* Export feature through its root `index.ts` inside the feature folder.

**Imports**

* Pages import **only** from `features/*/ui` and/or the feature's public `index.ts`.
* Shared items — from `shared/*`.

**UI**

* Chakra UI: centralized theme and tokens.
* Modals: `useDisclosure`; live in `features/*/ui`.
* States: `Spinner` → `ErrorMessage` → `EmptyState` → content.

**Do not**

* ❌ Create global stores for feature-local concerns.
* ❌ Mix several unrelated API calls in a single `queryFn`.

---

# 5) State management

## 5.1 React Query (mandatory pattern for CRUD/fetching)

**Query keys** must include `projectId`:

```ts
// NEW: Use useProjectId() hook (preferred in new features)
import { useProjectId } from 'src/shared/contexts/ProjectContext';

const projectId = useProjectId();

return useQuery({
  queryKey: ['api-keys', projectId || undefined],
  queryFn: async () => {
    if (!projectId) return [];
    const { data, error } = await getProjectTonApiTokens({
      query: { project_id: projectId.toString() }
    });
    if (error) throw error;
    return data.items.map(mapDTOToApiKey);
  },
  enabled: !!projectId,
});
```

**Important: projectId in new features**

* ✅ **NEW CODE**: Use `const projectId = useProjectId()` from `ProjectContext`
* **Current Status**: `ProjectContext` is the single source of truth (localStorage persistence built-in).
* Include `projectId` in all query keys to prevent cross-project cache collisions

**Mutations & cache**

* **Important**: Capture `projectId` in `mutationFn` at mutation time (not hook closure):
  ```ts
  mutationFn: async (data) => {
    const currentProjectId = projectId;  // Capture at mutation start
    if (!currentProjectId) throw new Error('Project not selected');

    const response = await apiCall(...);

    return { ...response, _projectId: currentProjectId };  // Return for onSuccess
  },
  onSuccess: (data) => {
    // Use projectId from mutation result, not from hook closure
    queryClient.invalidateQueries({
      queryKey: ['api-keys', data._projectId]
    });
  }
  ```
* Prevents race conditions when projectId changes during async operations
* Simple add: `queryClient.setQueryData(['api-keys', projectId], updater)`.
* Complex cases: `queryClient.invalidateQueries({ queryKey: ['api-keys', projectId] })`.

---

# 6) Working with the API and models

## 6.1 DTO → Domain models

1. Define domain interfaces in `model/interfaces/`.
2. Create mappers from SDK DTO → domain model.
3. Return **domain models** from `queryFn` (not DTOs).

```ts
// model/interfaces/api-key.ts
export interface ApiKey {
  id: string;
  label: string;
  createdAt: number; // unix sec
}

// model/queries.ts
const mapDTOToApiKey = (dto: DTO_TonApiToken): ApiKey => ({
  id: dto.id,
  label: dto.label,
  createdAt: dto.created_at,
});
```

## 6.2 SDK generation

* Files in `src/shared/api/console/*` are generated from `scripts/swagger.yaml`.
* **Never edit them manually.**
* Regenerate via: `npm run api:generate` (only when swagger changed).
* Additional generators: `generate-webhooks`, `generate-airdrop`, `generate-airdrop2` — **leave untouched** unless required by a task.

---

# 7) Time series and charts (Recharts)

* Unified data shape: `{ time: number; value: number | undefined }[]`, where `time` is unix seconds.
* X axis: `domain={['dataMin', 'dataMax']}`.
* Pre-filter `undefined` values (avoid holes during render).
* Default margin: `{ left: 0, right: 0 }`.
* Example transformation:

```ts
const toLiteproxySeries = (data: TonApiStats) =>
  data.chart
    .filter(i => i.liteproxyRequests !== undefined)
    .map(i => ({ time: i.time, value: i.liteproxyRequests }));
```

---

# 8) Routing

* Pages in `src/pages/*` **do not** contain business logic — composition only.
* Code-splitting by pages.
* 404/NotFound is mandatory.

## 8.1 Maintenance mode

Controlled via `src/shared/config/maintenance.ts`:

```ts
export const maintenanceConfig: MaintenanceConfig = {
    enabled: true,                              // toggle on/off
    estimatedEndTime: "2026-02-16T08:30:00Z",   // optional ISO 8601
    message: "Custom message here."             // optional
};
```

* Landing page stays accessible for unauthenticated users.
* Authenticated users see a full-screen maintenance page (`src/shared/ui/MaintenancePage.tsx`).
* Bypass on a specific browser: `localStorage.setItem('bypass_maintenance', '1')` + reload.
* Guard logic lives in `src/pages/index.tsx` — `isMaintenanceActive()` check after auth.

---

# 9) Testing, quality, Definition of Done

**Commands**

```bash
npm run dev
npm run dev-host

npm run typecheck
npm run lint
npm run lint:fix
npm run test

npm run build
npm run build:staging
npm run preview

npm run api:generate
# (other generators only when required)
npm run generate-webhooks
npm run generate-airdrop
npm run generate-airdrop2
```

**Definition of Done (required)**

* ✅ `npm run typecheck` — 0 errors
* ✅ `npm run lint` — 0 errors (at least in changed files)
* ✅ Tests (where applicable) are green
* ✅ No `any` and no implicit types in the changes
* ✅ UI states covered (loading/error/empty)
* ✅ Mutations update cache correctly

---

# 10) Migration history (MobX → React Query)

**Historical context:** The project previously used MobX stores for server state management. In 2025, we completed a full migration to React Query (`@tanstack/react-query`) for all CRUD and data fetching operations.

**Current state:**
- ✅ All major features use React Query (API Keys, Webhooks, Statistics, Liteservers, Pricing, Balance, Rates, NFT, Faucet, App Messages, Jetton, Projects, Invoices)
- ⚠️ A few isolated modules (Analytics, Airdrop) retain localized MobX stores within their components for internal state management only
- ✅ No global stores — `ProjectContext` manages project selection with React Query

**For new features:** Always use React Query. See patterns in §5.1 and examples in §19.

---

# 11) Security and secrets

* Do not log secrets/API keys/tokens.
* Environment configuration via **ENV**, no hardcoding.
* TON API permissions — only via backend proxies where applicable.

---

# 12) Performance

* Real-time: use `refetchInterval` only where needed (see Balance).
* Use `staleTime` consciously; by default treat data as "stale" for freshness.
* Avoid unnecessary re-renders: memoize props for heavy tables/lists.
* Lazy-load pages/features.

---

# 13) UX, accessibility

* States (loading/error/empty) are mandatory.
* Keyboard accessibility for modals and focus — Chakra is fine by default, do not break it.
* All text is in English.

---

# 14) Time series and periods (TON metrics)

* Time units in API: unix (seconds).
* Common case: last 7 days with 30-minute intervals.
* Centralize date formatting utilities.
* Example: `const weekAgo = Math.round(Date.now() / 1000 - 3600 * 24 * 7)`.

---

# 15) Git and workflow

* Branch from `master`. Commits are atomic.
* Commit messages are meaningful.
* **Important:** tools/assistants **must not** run `git add/commit/push` without an explicit request.
* Before PR: pass DoD (§9).
* Review checklist:

  * [ ] Matches React Query patterns
  * [ ] No `any`/implicit types
  * [ ] React Query cache updates are correct
  * [ ] UI states covered
  * [ ] Generated files unchanged manually

---

# 16) Self‑update protocol (for AI)

**Goal:** keep this file up-to-date and compact, without clutter.

**Golden rules**

1. Do not duplicate rules; if there is a conflict, link to the existing point and refine the wording in a single place.

**Before writing changes AI must:**

* make sure the changes reflect the actual state of the code/repo;

---

# 17) Examples (reference snippets)

## 17.1 CRUD component (pattern)

```tsx
// features/tonapi/api-keys/ui/ApiKeys.tsx
export const ApiKeys: FC = () => {
  const { data: apiKeys, isLoading, error } = useApiKeysQuery();
  const { mutate: deleteKey, isPending } = useDeleteApiKeyMutation();

  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage error={error} />;

  return (
    <Overlay h="fit-content">
      {apiKeys?.length ? (
        <ApiKeysTable data={apiKeys} onDelete={id => deleteKey({ id })} isBusy={isPending} />
      ) : (
        <EmptyState onAction={() => {/* open create modal */}} />
      )}
    </Overlay>
  );
};
```

## 17.2 Query hook (pattern)

```ts
// features/tonapi/api-keys/model/queries.ts
import { useProjectId } from 'src/shared/contexts/ProjectContext';

export function useApiKeysQuery() {
  const projectId = useProjectId();
  return useQuery({
    queryKey: ['api-keys', projectId || undefined],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await getProjectTonApiTokens({
        query: { project_id: projectId.toString() }
      });
      if (error) throw error;
      return data.items.map(mapDTOToApiKey);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000  // 5 minutes
  });
}
```

## 17.3 Mutation with projectId capture (pattern - IMPORTANT)

```ts
// features/tonapi/api-keys/model/queries.ts
export function useDeleteApiKeyMutation() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (keyId: string) => {
      // Capture projectId at mutation time to prevent race conditions
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      await deleteApiKey(keyId, { project_id: currentProjectId.toString() });

      return { keyId, projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Use projectId from mutation result, not from hook closure
      queryClient.invalidateQueries({
        queryKey: ['api-keys', data.projectId]
      });
    }
  });
}
```

**Why capture projectId?** If user changes project while request is in flight, `onSuccess` uses stale projectId from closure, invalidating wrong cache. By capturing in `mutationFn` and returning, we ensure correct cache invalidation.

---

# 18) Resources

* Repository: `ton-console`
* Main branch: `master`
* Liteservers documentation: link available in the UI

---

# 19) Command reference (for convenience)

```bash
# Dev
npm run dev
npm run dev-host

# Quality
npm run typecheck
npm run lint
npm run lint:fix
npm run test

# Build/preview
npm run build
npm run build:staging
npm run preview

# API generation
npm run api:generate

# Other generators (only when required)
npm run generate-webhooks
npm run generate-airdrop
npm run generate-airdrop2
```

---
