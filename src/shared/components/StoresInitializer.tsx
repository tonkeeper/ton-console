import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { projectsStore } from '../stores/root.store';
import { awaitValueResolved } from '../lib/mobx/await-value-resolved';

export const StoresInitializer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await awaitValueResolved(projectsStore.projects$);
            setIsInitialized(true);
        };

        initialize();
    }, []);

    if (!isInitialized) {
        return null; // или можно вернуть компонент загрузки
    }

    return <>{children}</>;
};
