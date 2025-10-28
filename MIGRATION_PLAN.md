# MobX → React Query + useContext Migration Plan

**Status:** In Progress (Phase 1 — Simple stores)
**Last Updated:** 2025-10-29
**Estimated Duration:** 9-14 days
**Risk Level:** HIGH (ProjectsStore is central hub with 15 dependencies)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Analysis](#architecture-analysis)
3. [Migration Phases](#migration-phases)
4. [Store Categories](#store-categories)
5. [Success Criteria](#success-criteria)
6. [Risk Management](#risk-management)
7. [Detailed Checklists](#detailed-checklists)

---

## Overview

This plan describes a systematic 4-phase migration from MobX to React Query + React Context API for the TON Console project.

### Key Goals

1. **Phase 1:** Migrate "leaf stores" (5) that only depend on projectsStore → React Query hooks
2. **Phase 1.5:** Replace all `projectsStore.selectedProject?.id` references with `useProjectId()` hook
3. **Phase 2:** Migrate remaining simple stores (2) + localize complex table stores (2) to components with projectId injection
4. **Phase 2.5:** Localize remaining complex stores (3-4) to components with dependency injection (minimal effort)
5. **Phase 3:** Remove ProjectsStore (the critical hub) — move logic to React Query
6. **Phase 4:** Migrate remaining global stores (UserStore, AppStore)

### Constraints & Assumptions

- **ProjectsStore is THE BOTTLENECK:** 15 stores depend on it
- **No circular dependencies detected** — architecture allows clean migration
- **ProjectIdContext already exists** — created as temporary bridge (in progress)
- **React Query is mandatory** for all CRUD/fetching per CLAUDE.md
- **localStorage persistence** must be preserved for selectedProjectId
- **No breaking changes** — UI should work identically after each phase

---

## Architecture Analysis

### All MobX Stores: 21 Total

#### Global Stores (3)
- **ProjectsStore** (296 LOC) — CRITICAL HUB — 15 stores depend on this
- **UserStore** (125 LOC) — Auth, profile (exception candidate for Phase 4)
- **AppStore** (29 LOC) — Initialization flag (minimal)

#### Entity Stores (2)
- **ProjectsStore** — Central (see above)
- **DappStore** (163 LOC) — Messages app, depends on ProjectsStore

#### Feature Stores (16)
1. **TonApiStatsStore** (156 LOC) — REST/Liteproxy metrics
2. **LiteproxysStore** (135 LOC) — Liteproxy key management
3. **RestApiTiersStore** (128 LOC) — REST API tier pricing
4. **JettonStore** (316 LOC) — Jetton minter management (NO projectsStore dependency)
5. **CNFTStore** (116 LOC) — Compressed NFT indexing
6. **FaucetStore** (119 LOC) — Testnet coin faucet
7. **AppMessagesStore** (151 LOC) — Messages packages, balance, stats
8. **InvoicesAppStore** (291 LOC) — Invoices CRUD, webhooks, statistics
9. **InvoicesTableStore** (438 LOC) — Pagination + filtering (monolithic UI state)
10. **AirdropsStore** (52 LOC) — Airdrop list (simple)
11. **AirdropStore** (219 LOC) — Airdrop deployment (context-based)
12. **AnalyticsQueryStore** (367 LOC) — SQL query execution (very complex)
13. **AnalyticsGPTGenerationStore** (84 LOC) — GPT SQL generation
14. **AnalyticsGraphQueryStore** (132 LOC) — Graph analytics
15. **AnalyticsHistoryTableStore** (191 LOC) — Query history pagination
16. **AnalyticsQueryRequestStore** (124 LOC) — Query estimation

### Dependency Graph

```
RootStore
├── UserStore
├── AppStore
└── ProjectsStore (CRITICAL HUB)
    ├── DappStore
    ├── TonApiStatsStore
    ├── LiteproxysStore
    ├── RestApiTiersStore
    ├── AppMessagesStore
    │   └── DappStore (also depends on this)
    ├── InvoicesAppStore
    ├── InvoicesTableStore
    ├── AirdropsStore
    ├── AnalyticsQueryStore
    ├── AnalyticsGPTGenerationStore
    ├── AnalyticsGraphQueryStore
    ├── AnalyticsHistoryTableStore
    ├── AnalyticsQueryRequestStore
    ├── CNFTStore
    └── FaucetStore

JettonStore (INDEPENDENT — no projectsStore dependency)
AirdropStore (context-based, not global)
```

### ProjectIdContext Status (Already In Progress)

**Location:** `src/shared/contexts/ProjectIdContext.tsx`
**Bridge:** `src/app/providers/with-project-id.tsx`
**Current Usage:** Only webhooks feature (Phase 1 completed)

**How it works:**
- Manages `projectId` state via React Context
- `ProjectIdInitializer` component syncs MobX `projectsStore` → Context
- `useProjectId()` hook provides current projectId
- Race condition protection with `isMounted` flag

---

## Migration Phases

### **Phase 1: Migrate Leaf Stores to React Query (5 stores)**

**Objective:** Migrate simple stores that only depend on projectsStore → useQuery hooks

**Stores to migrate (in order):**

1. **TonApiStatsStore** (156 LOC)
   - Path: `src/features/tonapi/statistics/model/ton-api-stats.store.ts`
   - Create: `src/features/tonapi/statistics/model/queries.ts`
   - Hooks: `useRestStats()`, `useLiteproxyStats()`
   - Usage: Statistics page components

2. **LiteproxysStore** (135 LOC)
   - Path: `src/features/tonapi/liteproxy/model/liteproxy.store.ts`
   - Create: `src/features/tonapi/liteproxy/model/queries.ts`
   - Hooks: `useLiteproxyList()`, `useLiteproxyTiers()`, `useSelectedTier()`, mutations
   - Usage: Liteproxy pages

3. **RestApiTiersStore** (128 LOC)
   - Path: `src/features/tonapi/pricing/model/rest-api-tiers.store.ts`
   - Create: `src/features/tonapi/pricing/model/queries.ts`
   - Hooks: `useTiers()` (global), `useSelectedTier()`, mutations
   - Usage: Pricing/tier selection pages

4. **CNFTStore** (116 LOC)
   - Path: `src/features/nft/model/cnft.store.ts`
   - Create: `src/features/nft/model/queries.ts`
   - Usage: NFT feature

5. **FaucetStore** (119 LOC)
   - Path: `src/features/faucet/model/faucet.store.ts`
   - Create: `src/features/faucet/model/queries.ts`

**Pattern for each migration:**
```typescript
// Create: features/{domain}/{feature}/model/queries.ts

import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useMyQuery() {
  const projectId = useProjectId();

  return useQuery({
    queryKey: ['my-feature', projectId || undefined],
    queryFn: async () => {
      if (!projectId) return null;
      // fetch logic
    },
    enabled: !!projectId,
  });
}

export function useMyMutation() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (data) => {
      const currentProjectId = projectId; // Capture at mutation time
      if (!currentProjectId) throw new Error('Project not selected');
      // mutation logic
      return { ...result, _projectId: currentProjectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['my-feature', data._projectId]
      });
    }
  });
}
```

**For each store:**
- [ ] Create `queries.ts` with all hooks
- [ ] Remove `observer()` from components
- [ ] Replace store imports with hook imports
- [ ] Update components to use hooks instead of store properties
- [ ] Delete old `.store.ts` file
- [ ] Run `npm run typecheck` — 0 errors
- [ ] Run `npm run lint:fix`
- [ ] Test manually in browser

### **Phase 1.5: Remove projectsStore References**

**Objective:** Replace all `projectsStore.selectedProject?.id` with `useProjectId()`

**Actions:**
```bash
# Find all references
grep -r "projectsStore\.selectedProject" src/

# For each reference found:
# 1. Replace with: const projectId = useProjectId();
# 2. Use projectId in queryKey
# 3. Remove observer() wrapper if it was only for this
# 4. Test
```

**Specific locations to update:**
- All component files still reading projectsStore
- Feature-specific stores that haven't been migrated yet
- Any UI components using `projectsStore.selectedProject?.name` etc.

---

### **Phase 2: Remaining Simple Stores + Complex Store Localization (4 stores)**

**Objective:** Migrate simple remaining stores + localize complex table stores to components with minimal effort

**Stores:**

1. **JettonStore** (316 LOC, wallet-based)
   - Create: `src/features/jetton/model/queries.ts`
   - Special: NO projectsStore dependency (wallet-based)
   - Hooks: `useJettonInfo()`, `useJettonWallet()`, mutations
   - Note: May need different cache strategy (wallet-based, not project-based)

2. **DappStore** (163 LOC)
   - Create: `src/features/app-messages/model/queries.ts`
   - Hooks: `useDapps()`
   - Update: AppMessagesStore to use new queries

3. **InvoicesTableStore** (438 LOC) → Localize to component (minimal effort)
   - Current: Global MobX store managing pagination + 5+ filter types
   - Target: Convert to class that can be instantiated in component constructor
   - Pattern: Similar to `AirdropStore` — receive dependencies in constructor
   ```typescript
   // NEW: src/features/invoices/models/invoices-table.store.ts (localized)
   export class InvoicesTableStore {
     constructor(private projectId: string | null) {
       makeObservable(this);
       // Initialize with projectId
     }
     // Keep ALL the same methods, just use this.projectId
   }

   // In component:
   const [tableStore] = useState(() => new InvoicesTableStore(projectId));
   const { data } = useObserver(() => tableStore.invoices$);
   ```
   - Benefit: Works immediately, no major refactoring
   - Trade-off: Still uses MobX (localized), not React Query yet
   - Will be fully migrated in Phase 2.5 or later

4. **AnalyticsHistoryTableStore** (191 LOC) → Localize to component (same approach)
   - Same pattern as InvoicesTableStore
   - Instantiate in component with projectId
   - Keep MobX, just remove global scope

---

### **Phase 2.5: Complex Store Refactoring (3 stores - Localization)**

**Objective:** Localize remaining complex stores to components (minimal effort approach)

Similar to Phase 2, these stores are localized to components with projectId injection:

1. **AppMessagesStore** (151 LOC) → Localize to component
   - Convert to class with projectId/dappStore in constructor
   - Instantiate in component: `new AppMessagesStore(projectId, dappStore)`
   - Keep all MobX logic as-is
   - Works immediately without migration to React Query
   - Future migration: Can split into hooks in Phase 3+

2. **InvoicesAppStore** (291 LOC) → Localize to component
   - Same pattern: receive projectId in constructor
   - Initialize in component state
   - Keep all existing logic
   - Works with current dependency structure

3. **AnalyticsQueryStore** (367 LOC) + Analytics supporting stores
   - Localize to Analytics feature
   - Pass projectId and dependencies in constructor
   - Keep MobX reactions and lifecycle (destroy() method)
   - Keep disposers as-is
   - No functional changes, just scope change

**Benefit of this approach:**
- ✅ Minimal effort (just change constructor, instantiation)
- ✅ Works immediately (no logic changes)
- ✅ Removes global dependencies
- ✅ Enables Phase 3 (ProjectsStore removal)
- ✅ Future migration to React Query becomes easier (isolated stores)

---

### **Phase 3: ProjectsStore Removal (CRITICAL)**

**Objective:** Remove the central hub that all other stores depend on

**Prerequisites:**
- ✅ All 15 dependent stores migrated to React Query
- ✅ All components use `useProjectId()` instead of `projectsStore.selectedProject`
- ✅ ProjectIdContext fully functional and stable

**Actions:**

1. Create `src/shared/queries/projects.ts`
   ```typescript
   // useProjects() — fetch all projects
   // useSelectProject(projectId) — set selected project in context + localStorage
   // useSelectedProject() — get selected project (read-only)
   ```

2. Implement localStorage persistence
   - Use React Query `onSuccess` callback
   - Or use custom persister

3. Replace all remaining projectsStore references
   ```bash
   grep -r "projectsStore" src/
   # Should be empty (except maybe in old comments)
   ```

4. Delete files:
   - `src/entities/project/model/projects.store.ts`
   - Remove ProjectsStore from `src/shared/stores/root.store.ts`

5. Verify:
   - [ ] All projects load on login
   - [ ] selectedProject persists across page refresh
   - [ ] Switching projects triggers all relevant queries to refetch
   - [ ] No TypeScript errors
   - [ ] No console errors

---

### **Phase 4: Remaining Global Stores**

**Objective:** Migrate or designate as exceptions the final stores

1. **UserStore** (125 LOC)
   - Decision: Keep as MobX exception (auth is critical) OR migrate to context
   - If keeping: Document why it's an exception
   - If migrating: Create context + hooks for auth state

2. **AppStore** (29 LOC)
   - Replace with: `useAppInitialized()` context hook
   - Or: Simple Provider pattern

3. **AnalyticsGPTGenerationStore**, **AnalyticsQueryRequestStore**, **AnalyticsGraphQueryStore**
   - Migrate similar to Phase 2.5 refactoring
   - Split into focused hooks

4. **AirdropsStore** (52 LOC)
   - Simple migration: `useAirdrops()`, `useAirdropConfig()`

---

## Store Categories

### **Category A: Leaf Stores (Phase 1)** ✓ First to migrate
- ✅ TonApiStatsStore
- ✅ LiteproxysStore
- ✅ RestApiTiersStore
- ✅ CNFTStore
- ✅ FaucetStore

**Why first?**
- Only depend on projectsStore
- No inter-store dependencies
- Clear migration path
- Validates the pattern before complex cases

### **Category B: Simple Dependent (Phase 2)**
- JettonStore (wallet-based, special case)
- DappStore (simple, enables AppMessagesStore migration)
- AirdropsStore (if not done in Phase 1)

### **Category C: Complex with Localization (Phase 2)**
- InvoicesTableStore → component-level hook (eliminates global store)
- AnalyticsHistoryTableStore → component-level hook
- Benefit: Reduces global state footprint

### **Category D: Monolithic Refactoring (Phase 2.5)**
- AppMessagesStore → 4 separate hooks
- InvoicesAppStore → 2 separate hooks
- AnalyticsQueryStore → 3+ separate hooks
- Analytics supporting stores (GPT, GraphQuery, QueryRequest)

### **Category E: Critical Hub (Phase 3)**
- ProjectsStore → Replace with shared/queries + ProjectIdContext
- Risk: ALL OTHER STORES depend on this
- Requires: Phase 1, 1.5, 2, 2.5 complete first

### **Category F: Global Exceptions (Phase 4)**
- UserStore (auth — may remain as exception)
- AppStore (init — can become hook)

---

## Success Criteria

### **Phase 1 (Leaf Stores)**
- [ ] TonApiStatsStore migrated
  - [ ] queries.ts created with `useRestStats()`, `useLiteproxyStats()`
  - [ ] Components updated to use hooks
  - [ ] Old .store.ts file deleted
  - [ ] No observer() wrappers
  - [ ] `npm run typecheck` — 0 errors
  - [ ] `npm run lint` — 0 errors
  - [ ] Manual test: Statistics page loads correctly

- [ ] LiteproxysStore migrated (same checklist)
- [ ] RestApiTiersStore migrated (same checklist)
- [ ] CNFTStore migrated (same checklist)
- [ ] FaucetStore migrated (same checklist)

**Overall Phase 1 Success:**
- [ ] All 5 stores have queries.ts files
- [ ] No .store.ts files for these 5 stores
- [ ] No `observer()` in new components
- [ ] All queryKeys include projectId
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] All features work identically

### **Phase 1.5 (Remove projectsStore References)**
- [ ] Grep for "projectsStore" returns <10 matches (exceptions only)
- [ ] All remaining matches are in:
  - [ ] Old comments (can delete)
  - [ ] Intentional exceptions (documented)
  - [ ] Other store files still being migrated
- [ ] Components don't import projectsStore directly
- [ ] All reading `selectedProject` uses `useProjectId()` instead
- [ ] `npm run lint` — 0 errors

### **Phase 2 (Complex Stores + Simple Remaining)**
- [ ] JettonStore migrated to queries.ts
- [ ] DappStore migrated to queries.ts
- [ ] InvoicesTableStore localized to component (constructor: projectId)
- [ ] AnalyticsHistoryTableStore localized to component (constructor: projectId)
- [ ] Store classes instantiated in components with dependencies
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] No global root.store.ts references to these stores

### **Phase 2.5 (Localize Complex Stores)**
- [ ] AppMessagesStore localized to component (constructor: projectId, dappStore)
- [ ] InvoicesAppStore localized to component (constructor: projectId)
- [ ] AnalyticsQueryStore + supporting stores localized to analytics feature
- [ ] All stores instantiated with dependencies in constructors
- [ ] MobX logic unchanged (only scope changed)
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] Stores still functional, just removed from global scope

### **Phase 3 (ProjectsStore Removal)**
- [ ] ProjectsStore deleted
- [ ] shared/queries/projects.ts created
- [ ] All project selection goes through context
- [ ] localStorage persistence works
- [ ] `grep -r "projectsStore" src/` returns 0 (except comments)
- [ ] `npm run typecheck` — 0 errors
- [ ] Manual test: Login → select project → refresh → project persists
- [ ] Manual test: Switch projects → all queries refetch
- [ ] Manual test: Logout → app clears properly

### **Phase 4 (Final)**
- [ ] UserStore decision made (migrate or document exception)
- [ ] AppStore migrated to hook/context
- [ ] All remaining stores handled
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] root.store.ts deleted or minimal

---

## Risk Management

### **Risk 1: ProjectsStore Dependency Avalanche**
| Metric | Value |
|--------|-------|
| Risk Level | 🔴 CRITICAL |
| Probability | HIGH |
| Impact | CATASTROPHIC |
| Mitigation | Strict phase ordering, frequent tests |

**Mitigation:**
- Migrate stores in dependency order (Phase 1 → 1.5 → 2 → 3)
- Don't start Phase 3 until all 15 stores confirm working with context
- Run full test suite after Phase 1, 2, 3
- Use feature flags if needed to toggle between implementations

### **Risk 2: localStorage Persistence**
| Metric | Value |
|--------|-------|
| Risk Level | 🟠 HIGH |
| Probability | MEDIUM |
| Impact | HIGH |
| Mitigation | Test persistence before Phase 3 |

**Current Implementation:** MobX `makePersistable` handles it
**New Implementation:** Manual `onSuccess` callback in mutation

**Test:**
1. Select project A
2. Refresh page → should still be project A
3. Logout → refresh → should clear
4. Login → should restore last project

### **Risk 3: Race Conditions During projectId Change**
| Metric | Value |
|--------|-------|
| Risk Level | 🟡 MEDIUM |
| Probability | MEDIUM |
| Impact | MEDIUM |
| Mitigation | ProjectIdContext + isMounted flag |

**Already mitigated by:**
- ProjectIdContext with proper synchronization
- with-project-id.tsx bridge component
- Capturing projectId in mutationFn at mutation time

### **Risk 4: Table Store Complexity**
| Metric | Value |
|--------|-------|
| Risk Level | 🟡 MEDIUM |
| Probability | MEDIUM |
| Impact | MEDIUM |
| Mitigation | Careful refactoring, component-level tests |

**InvoicesTableStore (438 LOC):**
- 15+ filter/sort methods
- Complex computed properties
- Multiple interdependent state pieces

**Approach:**
- Break into smaller concerns: `usePagination`, `useTableFilters`, `useSorting`
- Test each hook independently
- Verify filter logic still works

### **Risk 5: Analytics Disposal Pattern**
| Metric | Value |
|--------|-------|
| Risk Level | 🟢 LOW |
| Probability | LOW |
| Impact | MEDIUM |
| Mitigation | React Query handles cleanup automatically |

**Current:** Manual `destroy()` methods with disposers
**After:** useEffect cleanup + React Query lifecycle

**Benefit:** React Query automatically handles unsubscribe/abort

### **Risk 6: Circular Dependencies**
| Metric | Value |
|--------|-------|
| Risk Level | 🟢 LOW |
| Probability | LOW |
| Impact | CRITICAL |
| Mitigation | Static analysis, grep, code review |

**Current Status:** No circular dependencies detected
**Prevention:**
- Use static import analysis tools
- Code review before each phase completion
- Run `npx knip` to detect unused code

---

## Detailed Checklists

### **Checklist: Migrating a Leaf Store**

Use this for TonApiStatsStore, LiteproxysStore, RestApiTiersStore, CNFTStore, FaucetStore

```markdown
## {StoreName} Migration

### Pre-Migration
- [ ] Document current usage: `grep -r "import.*{StoreName}" src/`
- [ ] List all components using this store
- [ ] Screenshot current UI behavior (if visual)
- [ ] Note any special query params or cache behavior

### Create queries.ts
- [ ] Create `features/{domain}/{feature}/model/queries.ts`
- [ ] Add all read queries (useQuery hooks)
- [ ] Add all write mutations (useMutation hooks)
- [ ] Each query includes projectId in queryKey
- [ ] Use `const projectId = useProjectId()` pattern
- [ ] Capture projectId in mutationFn (not closure)
- [ ] Use queryClient.invalidateQueries in onSuccess
- [ ] Add proper TypeScript types (no `any`)
- [ ] Export from feature's index.ts

### Update Components
- [ ] Find all files importing this store
- [ ] Replace `import { store }` with `import { useHook }`
- [ ] Remove `observer()` wrapper (if no other MobX dependencies)
- [ ] Replace `store.data$` with `useHook().data`
- [ ] Replace `store.action()` with `mutation.mutate()`
- [ ] Test component in browser

### Delete Old Store
- [ ] Delete `{StoreName}.store.ts` file
- [ ] Remove from root.store.ts initialization (if imported)
- [ ] Remove from any index.ts exports

### Verify
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] `npm run lint:fix` if needed
- [ ] Manual browser test:
  - [ ] Feature still works
  - [ ] Data loads correctly
  - [ ] Mutations work
  - [ ] Switching projects refetches data
  - [ ] No console errors

### Documentation
- [ ] Add commit message: `refactor: migrate {StoreName} to React Query`
- [ ] Note any special cache handling
```

### **Checklist: Localize Table Store**

For InvoicesTableStore, AnalyticsHistoryTableStore

```markdown
## {TableStoreName} Localization

### Analysis
- [ ] Document current filter/sort/pagination logic
- [ ] List all filter types (status, currency, date, etc.)
- [ ] Note all computed properties
- [ ] Identify components using this store

### Create Component-Local Hook
- [ ] Create `{Component}State.ts` or similar
- [ ] Export `useTableState()` hook with:
  - [ ] `pagination` object (page, pageSize, hasNextPage)
  - [ ] `filters` object (all filter types)
  - [ ] `sorting` object (sortBy, direction)
  - [ ] Action methods (setFilter, setSorting, nextPage, etc.)
- [ ] Move all filter logic into hook
- [ ] Replace Loadable with useQuery

### Update Component
- [ ] Import `useTableState()` instead of store
- [ ] Use hook properties directly
- [ ] No observer() wrapper
- [ ] Test all filter combinations

### Delete Old Store
- [ ] Delete `{TableStoreName}.store.ts`
- [ ] Remove from root.store.ts
- [ ] Verify no other components use this store

### Verify
- [ ] All filters work
- [ ] Pagination works
- [ ] Sorting works
- [ ] Combined filters work
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
```

### **Checklist: Split Complex Store**

For AppMessagesStore, InvoicesAppStore, AnalyticsQueryStore

```markdown
## {ComplexStoreName} Refactoring

### Design Phase
- [ ] Identify separate concerns (queries)
- [ ] Document dependencies between queries
- [ ] Plan new hook names and responsibilities
- [ ] Identify any race conditions
- [ ] Plan cache invalidation strategy

### Create New Hooks
- [ ] For each query concern:
  - [ ] Create useQuery hook
  - [ ] Add to queries.ts
  - [ ] Write tests (if applicable)
  - [ ] Document parameters and return types

### Update Components
- [ ] Replace store imports with hook imports
- [ ] Update component to call multiple hooks
- [ ] Remove observer() wrapper
- [ ] Test all functionality

### Delete Old Store
- [ ] Delete `{ComplexStoreName}.store.ts`
- [ ] Remove from root.store.ts
- [ ] Remove destroy() methods
- [ ] Remove disposers (replaced by useEffect)

### Verify
- [ ] All original functionality works
- [ ] Data is cached correctly
- [ ] Cache invalidation works
- [ ] No race conditions on fast project switching
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] Performance is same or better
```

---

## Timeline Estimate

| Phase | Stores | Effort | Duration | Risk |
|-------|--------|--------|----------|------|
| 1 | 5 leaf stores | Medium | 2-3 days | Medium |
| 1.5 | Grep/replace | Low | 0.5-1 day | Low |
| 2 | 4 stores | Medium-High | 2-3 days | Medium |
| 2.5 | 3 complex stores | High | 2-3 days | High |
| 3 | ProjectsStore | High | 1-2 days | HIGH |
| 4 | Remaining stores | Medium | 1-2 days | Medium |
| **Total** | **21 stores** | **Very High** | **9-14 days** | **HIGH** |

---

## References

- **CLAUDE.md** — Project guidelines (§5.1, §10)
- **ProjectIdContext** — `src/shared/contexts/ProjectIdContext.tsx`
- **with-project-id.tsx** — Bridge component
- **Webhooks migration** — Reference implementation (Phase 1 completed)

---

## Status Tracking

### Phase 1
- [ ] TonApiStatsStore
- [ ] LiteproxysStore
- [ ] RestApiTiersStore
- [ ] CNFTStore
- [ ] FaucetStore

### Phase 1.5
- [ ] All projectsStore references removed

### Phase 2
- [ ] JettonStore
- [ ] DappStore
- [ ] InvoicesTableStore localized
- [ ] AnalyticsHistoryTableStore localized

### Phase 2.5
- [ ] AppMessagesStore split
- [ ] InvoicesAppStore split
- [ ] AnalyticsQueryStore split

### Phase 3
- [ ] ProjectsStore removed

### Phase 4
- [ ] UserStore (decision: migrate or exception)
- [ ] AppStore migrated
- [ ] Remaining stores handled

---

**Created:** 2025-10-29
**Next Review:** After Phase 1 completion
