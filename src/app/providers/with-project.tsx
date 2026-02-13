import React, { FC, ReactNode } from 'react';
import { ProjectProvider } from 'src/shared/contexts/ProjectContext';

/**
 * Provider for managing the selected project
 *
 * Migration complete: Now uses React Query + ProjectContext
 * instead of MobX stores.
 *
 * Features:
 * - Fetches projects via React Query
 * - Manages selected project with localStorage persistence
 * - Auto-selects first project if none selected
 * - Provides useProject(), useProjectId(), etc. hooks
 */
export const withProject = (Component: FC<{ children: ReactNode }>) => (
    children: ReactNode
) => (
    <ProjectProvider>
        <Component>{children}</Component>
    </ProjectProvider>
);
