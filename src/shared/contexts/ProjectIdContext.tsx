import { createContext, useContext, ReactNode, FC, useState } from 'react';

interface ProjectIdContextType {
    projectId: number | null;
    projectName: string | null;
    setProjectId: (id: number | null) => void;
    setProjectName: (name: string | null) => void;
}

const ProjectIdContext = createContext<ProjectIdContextType | undefined>(undefined);

/**
 * Provider for managing the selected project ID and name
 * Acts as a bridge to translate projectsStore (MobX) values to React Context
 * Does NOT persist to localStorage - persistence is handled by projectsStore
 */
export const ProjectIdProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [projectId, setProjectId] = useState<number | null>(null);
    const [projectName, setProjectName] = useState<string | null>(null);

    return (
        <ProjectIdContext.Provider value={{ projectId, projectName, setProjectId, setProjectName }}>
            {children}
        </ProjectIdContext.Provider>
    );
};

/**
 * Hook to get the current project ID
 * @returns Project ID or null if not selected
 */
export function useProjectId(): number | null {
    const context = useContext(ProjectIdContext);
    if (context === undefined) {
        throw new Error('useProjectId must be used within ProjectIdProvider');
    }
    return context.projectId;
}

/**
 * Hook to set the current project ID
 */
export function useSetProjectId(): (id: number | null) => void {
    const context = useContext(ProjectIdContext);
    if (context === undefined) {
        throw new Error('useSetProjectId must be used within ProjectIdProvider');
    }
    return context.setProjectId;
}

/**
 * Hook to get and set the project ID simultaneously
 */
export function useProjectIdManager(): [number | null, (id: number | null) => void] {
    const context = useContext(ProjectIdContext);
    if (context === undefined) {
        throw new Error('useProjectIdManager must be used within ProjectIdProvider');
    }
    return [context.projectId, context.setProjectId];
}

/**
 * Hook to get the current project name
 * @returns Project name or null if not selected
 */
export function useProjectName(): string | null {
    const context = useContext(ProjectIdContext);
    if (context === undefined) {
        throw new Error('useProjectName must be used within ProjectIdProvider');
    }
    return context.projectName;
}

/**
 * Hook to set the current project name
 */
export function useSetProjectName(): (name: string | null) => void {
    const context = useContext(ProjectIdContext);
    if (context === undefined) {
        throw new Error('useSetProjectName must be used within ProjectIdProvider');
    }
    return context.setProjectName;
}
