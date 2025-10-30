import React, { FC, ReactNode, useEffect } from 'react';
import { ProjectProvider, useSetProject } from 'src/shared/contexts/ProjectContext';
import { projectsStore } from 'src/shared/stores';
import { reaction } from 'mobx';

/**
 * Component to initialize ProjectIdContext from projectsStore (legacy)
 *
 * TEMPORARY SOLUTION: Translates projectId and projectName from MobX store to React Context.
 * When all dependencies on projectsStore are migrated,
 * the logic will be moved completely into ProjectProvider.
 */
const ProjectIdInitializer: FC<{ children: ReactNode }> = ({ children }) => {    
    const setProject = useSetProject();

    // Single useEffect - initialization and sync with projectsStore
    // Combined to prevent race conditions
    useEffect(() => {
        let isMounted = true;

        // Initialize current values from store
        const selectedProject = projectsStore.selectedProject;
        if (isMounted) {
            if (selectedProject?.id) {
                setProject(selectedProject);
            } else {
                setProject(null);
            }
        }

        // Sync changes in store (MobX reaction)
        // This callback will be called whenever projectsStore.selectedProject changes
        const dispose = reaction(
            () => projectsStore.selectedProject,
            (project) => {
                // Only update state if component is still mounted
                if (isMounted) {
                    if (project?.id) {
                        setProject(project);
                    } else {
                        setProject(null);
                    }
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
export const withProject = (Component: FC<{ children: ReactNode }>) => (
    children: ReactNode
) => (
    <ProjectProvider>
        <ProjectIdInitializer>
            <Component>{children}</Component>
        </ProjectIdInitializer>
    </ProjectProvider>
);
