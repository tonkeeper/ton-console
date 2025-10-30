import { createContext, useContext, ReactNode, FC, useState, useEffect } from 'react';
import { useProjectsQuery } from 'src/shared/queries/projects';
import { Project } from 'src/entities/project/model/interfaces/project';
import { useUserQuery } from 'src/entities/user/queries';

interface ProjectContextType {
    selectedProjectId: number | null;
    selectedProject: Project | null;
    selectProject: (id: number | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'SelectedProject:selectedProjectId';

/**
 * Provider for managing selected project with localStorage persistence
 *
 * Responsibilities:
 * - Maintains selectedProjectId state
 * - Persists selection to localStorage
 * - Auto-selects first project if none selected
 * - Provides selectedProject from projects list
 * - Integrates with React Query for projects data
 * - Only fetches projects when user is authenticated
 */
export const ProjectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Check if user is authenticated
    const { data: user } = useUserQuery();
    
    // Only fetch projects if user is logged in
    const { data: projects = [] } = useProjectsQuery({ enabled: !!user });

    // Initialize from localStorage
    const [selectedProjectId, setSelectedProjectIdState] = useState<number | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    // Get selected project from projects list
    const selectedProject =
        projects.find(project => project.id === selectedProjectId) || projects[0] || null;

    // Sync to localStorage whenever selectedProjectId changes
    useEffect(() => {
        try {
            if (selectedProjectId !== null) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProjectId));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Failed to persist selectedProjectId to localStorage:', error);
        }
    }, [selectedProjectId]);

    // Auto-select first project if none selected and projects available
    useEffect(() => {
        if (selectedProjectId === null && projects.length > 0) {
            setSelectedProjectIdState(projects[0].id);
        }
    }, [selectedProjectId, projects]);

    const selectProject = (id: number | null) => {
        setSelectedProjectIdState(id);
    };

    return (
        <ProjectContext.Provider
            value={{ selectedProjectId, selectedProject, selectProject }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

/**
 * Hook to get the current project ID
 * @throws Error if no project is selected
 */
export function useProjectId(): number {
    return useProject().id;
}

/**
 * Hook to get the current project (nullable)
 * @returns Project or null if not selected
 */
export function useMaybeProject(): Project | null {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useMaybeProject must be used within ProjectProvider');
    }
    return context.selectedProject;
}

/**
 * Hook to get the current project
 * @throws Error if no project is selected
 */
export function useProject(): Project {
    const project = useMaybeProject();
    if (project === null) {
        throw new Error('Project is not selected');
    }
    return project;
}

/**
 * Hook to select a project by ID
 */
export function useSetProject(): (id: number | null) => void {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useSetProject must be used within ProjectProvider');
    }
    return context.selectProject;
}
