import { createContext, useContext, ReactNode, FC, useState } from 'react';
import { Project } from 'src/entities/project/model/interfaces/project';

interface ProjectContextType {
    project: Project | null;
    setProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * Provider for managing the selected project ID and name
 * Acts as a bridge to translate projectsStore (MobX) values to React Context
 * Does NOT persist to localStorage - persistence is handled by projectsStore
 */
export const ProjectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<Project | null>(null);

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

/**
 * Hook to get the current project ID
 * @returns Project ID or null if not selected
 */
export function useProjectId(): number {
    return useProject().id;
}

export function useMaybeProject(): Project | null {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        return null;
    }
    return context.project;
}

/**
 * Hook to get the current project object
 * @returns Full Project object or null if not selected
 */
export function useProject(): Project {
    const project = useMaybeProject();
    if (project === null) {
        throw new Error('Project is not selected');
    }
    return project;
}

/**
 * Hook to set the current project object
 */
export function useSetProject(): (project: Project | null) => void {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useSetProject must be used within ProjectProvider');
    }
    return context.setProject;
}
