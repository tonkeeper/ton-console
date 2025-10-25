# TON Console - Developer Guide

## Overview

TON Console is a web application for managing TON blockchain API access, providing dashboards for API metrics, managing liteproxy servers, webhooks, and API key administration.

## Tech Stack

- **React 19.2.0** with TypeScript 5.9.3 (strict mode)
- **Vite 5.4.6** for build tooling
- **MobX 6.15.0** for global state management (legacy, migrating away)
- **@tanstack/react-query 5.90.5** for server state (**RECOMMENDED** for CRUD operations)
- **Chakra UI 2.10.9** for UI components
- **Recharts 2.5.0** for data visualization
- **React Router DOM 6.9.0** for routing
- **Vitest** for unit tests
- **ESLint 9.38.0** with TypeScript support for code quality
- **Prettier 3.6.2** for code formatting

## Project Architecture

### Folder Structure

```
src/
├── app/              # Application entry, providers, routing
├── pages/            # Route pages (import and compose features)
│   └── tonapi/
│       ├── api-keys/     # Just render the feature
│       ├── liteservers/
│       ├── webhooks/
│       └── pricing/
├── features/         # Business logic grouped by domain
│   └── tonapi/
│       ├── api-keys/            # {model/, ui/, index.ts}
│       │   ├── model/
│       │   │   ├── queries.ts   # (NEW) React Query hooks
│       │   │   └── interfaces/  # Type definitions
│       │   ├── ui/              # Components (dumb UI)
│       │   └── index.ts         # Public exports
│       ├── webhooks/            # Similar structure (to be migrated)
│       ├── statistics/          # MobX store (legacy, reference)
│       └── liteproxy/           # MobX store (legacy, reference)
├── entities/         # Domain models and entity stores
├── shared/           # Reusable utilities, hooks, components
│   ├── api/
│   │   └── console/  # Auto-generated from swagger.yaml
│   ├── stores/       # Global stores only (projectsStore, userStore, etc)
│   ├── lib/          # Utilities (Loadable - legacy)
│   ├── ui/           # Shared UI components
│   └── hooks/        # Custom hooks (useLocalObservableWithDestroy - legacy)
└── processes/        # Side effects initialization
```

**Key principle:** Features are self-contained modules with their own model (data/queries) and UI (components). Pages are thin - they just compose features together without business logic.

**Modern approach (React Query):** Features manage server state via hooks, not stores. Components are pure UI.

### State Management Pattern

#### ✅ RECOMMENDED: React Query for CRUD/Server State

Use `@tanstack/react-query` for CRUD operations and fetching data from the server. This is the **preferred approach** for features with simple data management (like API Keys, Webhooks, etc).

**Benefits:**
- Automatic cache management
- Deduplication of requests
- Automatic refetch on dependency changes
- Built-in loading/error/success states
- No boilerplate with disposers
- Standard React hooks API

**Example structure (`src/features/tonapi/api-keys/`):**

```typescript
// model/queries.ts - React Query hooks
export function useApiKeysQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery({
        queryKey: ['api-keys', projectId],  // Refetch when projectId changes
        queryFn: async () => {
            const { data, error } = await getProjectTonApiTokens({
                query: { project_id: projectId! }
            });
            if (error) throw error;
            return data.items.map(mapDTOToApiKey);
        },
        enabled: !!projectId
    });
}

export function useCreateApiKeyMutation() {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    return useMutation({
        mutationFn: async (form: CreateApiKeyForm) => {
            const { data, error } = await generateProjectTonApiToken({
                query: { project_id: projectId! },
                body: { ...form }
            });
            if (error) throw error;
            return data.token;
        },
        onSuccess: (newKey) => {
            queryClient.setQueryData(['api-keys', projectId],
                (old: ApiKey[] | undefined) => [...(old || []), newKey]
            );
        }
    });
}
```

```typescript
// ui/ApiKeys.tsx - Component with observer() for projectId changes
const ApiKeys: FC = observer(() => {
    const { data: apiKeys, isLoading, error } = useApiKeysQuery();

    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage />;
    if (!apiKeys?.length) return <EmptyState />;

    return (
        <Overlay h="fit-content">
            <Button>Create</Button>
            <Table data={apiKeys} />
        </Overlay>
    );
});
```

**Key points:**
- Queries automatically invalidate when `queryKey` dependencies change (no disposers needed!)
- Mutations auto-update cache via `onSuccess`
- Component wrapped with `observer()` only to react to `projectsStore` changes, not for data states
- UI stays simple - just conditional rendering based on query states

---

#### ⚠️ DEPRECATED: MobX Store with Loadable (Legacy Pattern)

**Do not use for NEW features.** This pattern is kept only for existing features like statistics and liteproxy. Migrate to React Query when refactoring.

```typescript
// ❌ DEPRECATED - Use React Query instead
export class MyFeatureStore {
    data$ = new Loadable<MyData[]>([]);
    private disposers: Array<() => void> = [];

    constructor(private projectsStore: ProjectsStore) {
        makeAutoObservable(this);
        const dispose = createImmediateReaction(
            () => this.projectsStore.selectedProject?.id,
            (projectId) => {
                this.clearStore();
                if (projectId) this.fetchData();
            }
        );
        this.disposers.push(dispose);
    }

    fetchData = this.data$.createAsyncAction(async () => {
        const { data, error } = await getProjectData({...});
        if (error) throw error;
        return data.items.map(mapDTOToData);
    });

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
    }
}
```

**Loadable properties (for reference):**
- `isResolved`: true when loaded or error
- `isLoading`: true during fetch
- `value`: the data
- `error`: error object
- `state`: enum (unresolved, pending, ready, refreshing, resolveErrored, refetchErrored)

### Component Pattern

**✅ RECOMMENDED: React Query Pattern (for CRUD operations)**

```typescript
const ApiKeys: FC = observer(() => {
    // observer() only needed to react to projectsStore changes
    const { data: apiKeys, isLoading, error } = useApiKeysQuery();
    const { mutate: deleteKey } = useDeleteApiKeyMutation();

    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Overlay h="fit-content">
            {apiKeys?.length === 0 ? (
                <EmptyState onAction={() => {}} />
            ) : (
                <Table data={apiKeys} onDelete={deleteKey} />
            )}
        </Overlay>
    );
});
```

**Key points:**
- Wrap with `observer()` ONLY if accessing MobX stores (like `projectsStore`)
- Use query/mutation hooks for data fetching
- No props drilling - hooks provide state directly
- UI logic stays simple: render based on loading/error/data states
- Mutations handle cache updates automatically

**❌ DEPRECATED: MobX Store Pattern (Legacy)**

```typescript
// Do NOT use for new features
const MyComponent = observer(() => {
    const { isResolved, value, error } = someStore.data$;

    if (!isResolved) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!value) return <EmptyState />;

    return <DataDisplay data={value} />;
});
```

### Data Transformation

API responses come from auto-generated SDK (`src/shared/api/console/sdk.gen.ts`). Always:
1. Create domain model interfaces in `features/*/model/interfaces/`
2. Create mapping functions to transform DTOs to domain models
3. Use proper TypeScript typing (never use `any`)

**For React Query patterns:** Add mapping functions to `model/queries.ts` (see API Keys for example)

Example from liteproxy statistics:
```typescript
// Transform API response to chart data
const getLiteproxyRequestsData = (
    data: TonApiStats
): Array<{ time: number; value: number | undefined }> => {
    return data.chart
        .filter(item => item.liteproxyRequests !== undefined)
        .map(item => ({
            time: item.time,
            value: item.liteproxyRequests
        }));
};
```

## Code Style & TypeScript

### Requirements

- **TypeScript strict mode enabled** - always provide explicit types
- **No `any` types** - if you see `any`, find the root cause and fix the type
- **Explicit return types** for functions, especially after filter/map operations
- **Import from features** - pages should import UI components from `features/*/ui`, not local files

### Common Patterns

**For async operations (CRUD):**
- ✅ **NEW:** Use React Query hooks (`useQuery`, `useMutation`) in `model/queries.ts`
- Always make separate API calls for different data (don't mix concerns)
- Filter and map API responses with explicit return types before returning from `queryFn`
- ❌ **DEPRECATED:** `createAsyncAction()` is legacy MobX pattern - don't use for new features

**For charts/time-series data:**
- Transform data to `{ time: number, value: number }[]` format
- Use Recharts with `margin={{ left: 0, right: 0 }}` for full width
- Set XAxis domain to `['dataMin', 'dataMax']` for proper scaling
- Note: May still use MobX store for complex time-series logic (see statistics for reference)

**For modals:**
- Use Chakra UI `useDisclosure()` hook for modal state
- Place modal components in `features/*/ui/` (not pages)
- Pass callbacks via props: `onClick={onOpen}`, `onClose={onClose}`
- Export from feature's `index.ts`

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run dev-host        # Start dev server accessible from network

# Type checking & linting
npm run typecheck       # TypeScript type checking
npm run lint            # ESLint code quality check

# Testing
npm run test            # Run Vitest unit tests

# Building
npm run build           # Production build (with type checking)
npm run build:staging   # Staging build (for pre-production testing)
npm run preview         # Preview production build locally

# API code generation (SDK from Swagger)
npm run api:generate    # Regenerate SDK from swagger.yaml (using @hey-api/openapi-ts)

# Other API generators (don't touch unless you know what you're doing)
npm run generate-webhooks
npm run generate-airdrop
npm run generate-airdrop2
```

## Testing & Verification Checklist

Before declaring work complete:

```bash
# Run type check - must have ZERO errors
npm run typecheck 2>&1

# Run lint - must have ZERO errors (for your changes)
npm run lint 2>&1

# Run unit tests (if applicable)
npm run test 2>&1

# Review changes
git diff
git status
```

**Important:** Never claim work is ready if TypeScript, lint, or test errors exist. Always verify the full output.

**Reminder - Use React Query for NEW CRUD features:**
- ✅ Create `model/queries.ts` with `useQuery` and `useMutation` hooks
- ✅ Wrap component with `observer()` only if it uses MobX stores (like `projectsStore`)
- ✅ Let React Query handle caching and refetching automatically
- ❌ Don't create MobX Store classes for simple CRUD
- ❌ Don't use `useLocalObservableWithDestroy()` for server state

## Git Workflow

- Create feature branches from `master`
- Keep commits atomic and focused
- Include only necessary files in commits (no auto-generated files unless API changed)
- Write clear commit messages
- Ensure all tests pass before committing

**IMPORTANT:** Do NOT interact with git (commit, add, push, etc.) unless explicitly asked by the user. Only make git operations when the user specifically requests it. This includes:
- Do NOT run `git add`, `git commit`, `git push`
- Do NOT use git hooks or auto-commit features
- Only run `git diff`, `git status` for information purposes when needed
- Wait for explicit user instructions before any git modifications

## Key Best Practices

### 1. Study Patterns BEFORE Coding

Before implementing a new feature:
- **For CRUD features:** Study `src/features/tonapi/api-keys/` as the reference React Query implementation
  - Look at `model/queries.ts` structure with hooks
  - Check how `observer()` is used with `useQuery`
  - See how mutations update cache in `onSuccess`
- **For legacy features:** Check statistics/liteproxy for MobX store patterns (for reference only)
- Check how UI components are organized and exported
- Look at data transformation patterns in mapping functions

### 2. Respect Auto-Generated Files

SDK files generated from OpenAPI spec (`src/shared/api/console/`):
- `sdk.gen.ts` - SDK functions with operationId
- `types.gen.ts` - TypeScript types (DTO prefix)
- `client.gen.ts` - HTTP client config

**Rules:**
- Do NOT modify them manually
- Do NOT revert them without checking Swagger API changes
- Regenerate with `npm run api:generate` after swagger.yaml updates
- ESLint automatically ignores these files
- They contain essential types and SDK methods for API integration

Other generators remain untouched:
- `src/shared/api/airdrop.generated.ts` (from `generate-airdrop`)
- `src/shared/api/rt.tonapi.generated.ts` (from other generators)

### 3. Analyze Root Cause, Don't Mask Errors

- TypeScript error? Identify what's wrongly typed
- Lint error? Understand why the rule triggered
- API error? Check which method/parameter is missing
- Never use `any` to bypass type errors

### 4. Feature Modularity

Each feature should:
- Live in `src/features/domain/featureName/`
- Have `model/` folder:
  - **For CRUD (new):** `queries.ts` with React Query hooks, `interfaces.ts` for types
  - **For legacy:** Store classes (being migrated to React Query)
- Have `ui/` folder for components (never contain business logic)
- Export publicly from `index.ts`
- Be importable as `import { Component } from 'src/features/domain/featureName'`

**Example structure (API Keys - reference implementation):**
```
src/features/tonapi/api-keys/
├── model/
│   ├── queries.ts          # React Query hooks
│   ├── interfaces/
│   │   ├── api-key.ts
│   │   ├── create-api-key-form.ts
│   │   └── index.ts
│   └── index.ts            # Export queries and types
├── ui/
│   ├── ApiKeys.tsx         # Main component with observer()
│   ├── ApiKeysTable.tsx
│   ├── CreateApiKeyModal.tsx
│   ├── EditApiKeyModal.tsx
│   ├── DeleteApiKeyModal.tsx
│   ├── EmptyApiKeys.tsx
│   └── index.ts            # Export all components
└── index.ts                # Export everything
```

### 5. Separate Concerns

- **Pages:** Compose features together, no business logic
- **Features (model):**
  - ✅ **NEW (React Query):** `queries.ts` manages data fetching via hooks
  - ❌ **DEPRECATED (MobX Store):** Used to manage fetching but being phased out
  - **Always:** Contains type definitions and transformations
- **Features (ui):** Display data, call mutations, emit events - never fetch data
- **Components:** Pure UI, receive data/callbacks as props
- **Imports flow:** pages → features (ui/model) → shared → base types

### 6. Migration Plan: React Query for Existing Features

**Status:** API Keys feature has been fully migrated to React Query as a reference implementation.

**Other features to migrate (in priority order):**

1. **Webhooks** (`src/features/tonapi/webhooks/`)
   - Similar CRUD pattern to API Keys
   - Already has store, should be straightforward migration

2. **Liteproxy** (`src/features/tonapi/liteproxy/`)
   - More complex (has server management operations)
   - Start after webhooks is done

3. **Statistics/Analytics**
   - Complex time-series data
   - Doesn't fit simple CRUD pattern
   - May need custom React Query setup
   - Consider last for migration

**How to migrate a feature:**

1. Create `model/queries.ts` with `useQuery` and `useMutation` hooks
2. Move data fetching logic from Store to query/mutation functions
3. Create DTO mapping functions
4. Update UI component to use hooks instead of store
5. Wrap component with `observer()` only for MobX store dependencies
6. Remove old store class and `useLocalObservableWithDestroy` calls
7. Test that data loads on mount and refetches when project changes
8. Update CLAUDE.md with pattern if there are special cases

**Reference:** See `src/features/tonapi/api-keys/` for the complete implementation.

## Project-Specific Notes

### API Client

**SDK-based API (using @hey-api/openapi-ts)**
- Generated from OpenAPI/Swagger spec (`scripts/swagger.yaml`)
- Located in `src/shared/api/console/`
  - `sdk.gen.ts` - operationId-based SDK functions (flat imports)
  - `types.gen.ts` - Generated TypeScript types with `DTO` prefix
  - `client.gen.ts` - HTTP client configuration
- Usage: Import functions directly: `import { getProjectData } from 'src/shared/api'`
- Response format: `const { data, error, response } = await getProjectData({ ... })`
- All API calls require `project_id` from `projectsStore.selectedProject`

**Other generators (not migrated):**
- `generate-webhooks` - uses `swagger-typescript-api`
- `generate-airdrop` - uses `swagger-typescript-api`
- `generate-airdrop2` - uses `swagger-typescript-api`

### Store Initialization & Data Fetching Strategy

**Core Principle:**
- **Data requests should only run on the page where they are needed**
- **Don't initialize stores globally without justified necessity**
- **Prefer local state management close to where it's used**

#### ✅ RECOMMENDED: React Query Hooks (for CRUD operations)

No initialization needed! Use hooks directly in components:

```typescript
// model/queries.ts
export function useApiKeysQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery({
        queryKey: ['api-keys', projectId],
        queryFn: async () => {
            // Automatically refetches when projectId changes
            const { data, error } = await getProjectTonApiTokens({
                query: { project_id: projectId! }
            });
            if (error) throw error;
            return data.items.map(mapDTOToApiKey);
        },
        enabled: !!projectId
    });
}

// ui/ApiKeys.tsx
const ApiKeys: FC = observer(() => {
    const { data, isLoading, error } = useApiKeysQuery();
    // No store initialization - just use the hook!
    return <div>...</div>;
});
```

**Why this is better:**
- ✅ No disposers or cleanup logic needed
- ✅ Automatic invalidation when `queryKey` changes
- ✅ Component lifecycle-aware caching
- ✅ Less boilerplate, more readable

#### ⚠️ DEPRECATED: Local MobX Store Pattern

**Only use if refactoring existing legacy code. Don't use for new features.**

```typescript
// ❌ DEPRECATED
const MyPage: FC = () => {
    const myStore = useLocalObservableWithDestroy(
        () => new MyFeatureStore(projectsStore)
    );
    return <MyPageContent />;
};
```

This pattern required:
- `useLocalObservableWithDestroy` wrapper
- `createImmediateReaction` setup
- `dispose()` cleanup logic
- Complex boilerplate

#### Global Stores (Rare Exception)

**Only use for truly global state needed across multiple unrelated pages:**
- `projectsStore` - core project management
- `userStore` - user authentication/info
- `appStore` - global UI state

**Do NOT add feature-specific stores to `root.store.ts`**. It's a smell that your state management is wrong.

### Time Series Data

When working with metrics/statistics:
- Use Unix timestamps (seconds) for API calls
- Common period: last 7 days with 30-min intervals
- Calculate: `weekAgo = Math.round(Date.now() / 1000 - 3600 * 24 * 7)`
- Format dates for display with `toLocaleDateString()` and `toLocaleTimeString()`

## Resources

- Project repository: `ton-console`
- Main branch: `master`
- Documentation on liteservers is linked in the UI
