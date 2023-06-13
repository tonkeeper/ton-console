import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const ApplyQueryParams: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const projectId = searchParams.get('project_id');
        if (projectId !== null) {
            searchParams.delete('project_id');
            setSearchParams(searchParams);
            setTimeout(() => projectsStore.selectProject(Number(projectId)));
        }
    }, []);

    return <>{children}</>;
};

export default observer(ApplyQueryParams);
