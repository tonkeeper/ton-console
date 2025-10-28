import { createContext, useContext, ReactNode, FC, useState } from 'react';

interface ProjectIdContextType {
    projectId: number | null;
    setProjectId: (id: number | null) => void;
}

const ProjectIdContext = createContext<ProjectIdContextType | undefined>(undefined);

/**
 * Provider for managing the selected project ID
 * Acts as a bridge to translate projectsStore (MobX) values to React Context
 * Does NOT persist to localStorage - persistence is handled by projectsStore
 */
export const ProjectIdProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [projectId, setProjectId] = useState<number | null>(null);

    return (
        <ProjectIdContext.Provider value={{ projectId, setProjectId }}>
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
