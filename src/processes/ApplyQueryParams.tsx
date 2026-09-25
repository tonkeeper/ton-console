import { FC, PropsWithChildren, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetProject } from 'src/shared/contexts/ProjectContext';

const ApplyQueryParams: FC<PropsWithChildren> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectProject = useSetProject();

    useEffect(() => {
        const projectId = searchParams.get('project_id');
        if (projectId !== null) {
            searchParams.delete('project_id');
            setSearchParams(searchParams);
            setTimeout(() => selectProject(Number(projectId)));
        }
    }, []);

    return <>{children}</>;
};

export default ApplyQueryParams;
