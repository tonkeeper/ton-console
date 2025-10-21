# TON Console - Developer Guide

## Overview

TON Console is a web application for managing TON blockchain API access, providing dashboards for API metrics, managing liteproxy servers, webhooks, and API key administration.

## Tech Stack

- **React 18.2.0** with TypeScript 5.6.2 (strict mode)
- **Vite 5.4.6** for build tooling
- **MobX 6.7.0** for state management
- **Chakra UI 2.6.1** for UI components
- **Recharts 2.5.0** for data visualization
- **React Router DOM 6.9.0** for routing

## Project Architecture

### Folder Structure

```
src/
├── app/              # Application entry, providers, routing
├── pages/            # Route pages (import and compose features)
│   └── tonapi/
│       ├── api-keys/
│       ├── liteservers/
│       ├── webhooks/
│       └── pricing/
├── features/         # Business logic grouped by domain
│   └── tonapi/
│       ├── api-keys/      # {model/, ui/, index.ts}
│       ├── statistics/    # {model/, ui/, index.ts}
│       ├── webhooks/      # {model/, ui/, index.ts}
│       └── liteproxy/     # {model/, ui/, index.ts}
├── entities/         # Domain models and entity stores
├── shared/           # Reusable utilities, hooks, components
│   ├── api/          # API client (auto-generated from swagger)
│   ├── stores/       # Root store initialization
│   ├── lib/          # Utilities (includes Loadable state wrapper)
│   ├── ui/           # Shared UI components
│   └── hooks/        # Custom hooks
└── processes/        # Side effects initialization
```

**Key principle:** Features are self-contained modules with their own model (stores) and UI (components). Pages compose these features together.

### State Management Pattern

Use MobX stores with the custom `Loadable<T>` wrapper for async operations:

```typescript
export class MyFeatureStore {
    data$ = new Loadable<MyData | null>(null);

    constructor() {
        makeAutoObservable(this);
        // Auto-fetch when project changes
        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();
                if (project) this.fetchData();
            }
        );
    }

    fetchData = this.data$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectData({
            project_id: projectsStore.selectedProject!.id,
            // ... other params
        });
        return mapDTOToData(response.data);
    });
}
```

**Loadable key properties:**
- `isResolved`: true when data is loaded or error occurred
- `isLoading`: true during fetch
- `value`: the loaded data (or null)
- `error`: error object if fetch failed
- `state`: full state enum (unresolved, pending, ready, refreshing, resolveErrored, refetchErrored)

### Component Pattern

Components should be wrapped with `observer()` from mobx-react-lite and follow this pattern:

```typescript
const MyComponent = observer(() => {
    const { isResolved, value, error } = someStore.data$;

    if (!isResolved) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!value) return <EmptyState />;

    return <DataDisplay data={value} />;
});

export default MyComponent;
```

**Important:** Components receive their state through closures over stores, not props (store-based state). Callback props can be passed for events.

### Data Transformation

API responses come from auto-generated client (`src/shared/api/api.generated.ts`). Always:
1. Create domain model interfaces in `features/*/model/interfaces/`
2. Create mapping functions to transform DTOs to domain models
3. Use proper TypeScript typing (never use `any`)

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

**For async operations:**
- Always make separate API calls for different data (don't mix concerns)
- Use `createAsyncAction()` to wrap async functions
- Filter and map API responses with explicit return types

**For charts:**
- Transform data to `{ time: number, value: number }[]` format
- Use Recharts with `margin={{ left: 0, right: 0 }}` for full width
- Set XAxis domain to `['dataMin', 'dataMax']` for proper scaling

**For modals:**
- Use Chakra UI `useDisclosure()` hook for modal state
- Place modal components in `features/*/ui/` (not pages)
- Export from feature's `index.ts`

## Common Commands

```bash
# Build and type-check
npm run build

# Type checking only (fast)
npm run test:ts

# Linting
npm run lint
npm run lint:fix

# Development server
npm run dev
```

## Testing & Verification Checklist

Before declaring work complete:

```bash
# Run type check - must have ZERO errors
npm run test:ts 2>&1

# Run lint - must have ZERO errors (for your changes)
npm run lint 2>&1

# Review changes
git diff
git status
```

**Important:** Never claim work is ready if TypeScript or lint errors exist. Always verify the full output.

## Git Workflow

- Create feature branches from `master`
- Keep commits atomic and focused
- Include only necessary files in commits (no auto-generated files unless API changed)
- Write clear commit messages
- Ensure all tests pass before committing

## Key Best Practices

### 1. Study Patterns BEFORE Coding

Before implementing a new feature:
- Find similar features in the codebase (webhooks, api-keys, statistics)
- Understand the store structure and how they fetch data
- Check how UI components are organized and exported
- Look at data transformation patterns

### 2. Respect Auto-Generated Files

Files like `src/shared/api/api.generated.ts` are generated from Swagger specs:
- Do NOT modify them manually
- Do NOT revert them without checking API changes
- They contain essential types and methods for API integration

### 3. Analyze Root Cause, Don't Mask Errors

- TypeScript error? Identify what's wrongly typed
- Lint error? Understand why the rule triggered
- API error? Check which method/parameter is missing
- Never use `any` to bypass type errors

### 4. Feature Modularity

Each feature should:
- Live in `src/features/domain/featureName/`
- Have `model/` folder for stores and interfaces
- Have `ui/` folder for components
- Export publicly from `index.ts`
- Be importable as `import { Component } from 'src/features/domain/featureName'`

### 5. Separate Concerns

- Pages compose features, don't contain business logic
- Stores manage data fetching and transformations
- Components display data and handle user interactions
- Imports flow: pages → features (ui/model) → shared → base types

## Project-Specific Notes

### API Client

- Generated from OpenAPI/Swagger spec
- Located in `src/shared/api/api.generated.ts`
- Accessed via `apiClient.api.*` methods
- All API calls require `project_id` from `projectsStore.selectedProject`

### Store Initialization

Root store (`src/shared/stores/root.store.ts`) exports main stores:
- `projectsStore` - manages selected project
- `userStore` - user information
- `tonApiStatsStore` - TonAPI statistics
- `liteproxysStore` - liteproxy servers

Feature stores are lazy-loaded when projects are ready. Access them from shared stores.

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
