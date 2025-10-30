import { FC, PropsWithChildren, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSetProject } from 'src/shared/contexts/ProjectContext';

const ApplyQueryParams: FC<PropsWithChildren> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const selectProject = useSetProject();

    useEffect(() => {
        // Handle GitHub Pages 404 redirect for SPA routing
        const pathParam = searchParams.get('p');
        if (pathParam !== null) {
            // Decode the saved path and navigate to it
            const decodedPath = pathParam.replace(/~and~/g, '&');
            searchParams.delete('p');
            setSearchParams(searchParams);
            navigate(decodedPath);
            return;
        }

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
