import React, { FC, ReactNode, useEffect } from 'react';
import { ProjectIdProvider, useSetProjectId } from 'src/shared/contexts/ProjectIdContext';
import { projectsStore } from 'src/shared/stores';
import { reaction } from 'mobx';

/**
 * Component to initialize ProjectIdContext from projectsStore (legacy)
 *
 * TEMPORARY SOLUTION: Translates projectId from MobX store to React Context.
 * When all dependencies on projectsStore are migrated,
 * the logic will be moved completely into ProjectIdProvider.
 */
const ProjectIdInitializer: FC<{ children: ReactNode }> = ({ children }) => {
    const setProjectId = useSetProjectId();

    // Single useEffect - initialization and sync with projectsStore
    // Combined to prevent race conditions
    useEffect(() => {
        let isMounted = true;

        // Initialize current value from store
        const selectedProject = projectsStore.selectedProject;
        if (isMounted) {
            if (selectedProject?.id) {
                setProjectId(selectedProject.id);
            } else {
                setProjectId(null);
            }
        }

        // Sync changes in store (MobX reaction)
        // This callback will be called whenever projectsStore.selectedProject?.id changes
        const dispose = reaction(
            () => projectsStore.selectedProject?.id,
            (projectId) => {
                // Only update state if component is still mounted
                if (isMounted) {
                    setProjectId(projectId || null);
                }
            }
        );

        return () => {
            isMounted = false;
            dispose();
        };
    }, []); // Empty - effect runs once on mount and subscribes via reaction

    return children as React.ReactNode;
};

/**
 * Provider for managing the selected project ID
 * Syncs state between React Context and projectsStore (legacy)
 */
export const withProjectId = (Component: FC<{ children: ReactNode }>) => (
    children: ReactNode
) => (
    <ProjectIdProvider>
        <ProjectIdInitializer>
            <Component>{children}</Component>
        </ProjectIdInitializer>
    </ProjectIdProvider>
);
