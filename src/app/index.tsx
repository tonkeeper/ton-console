import { FunctionComponent } from 'react';

import { withProviders } from './providers';
import Routing from 'src/pages';
import { AppInitialization, ApplyQueryParams } from 'src/processes';

const App: FunctionComponent<void> = () => {
    return (
        <AppInitialization>
            <ApplyQueryParams>
                <Routing />
            </ApplyQueryParams>
        </AppInitialization>
    );
};

export default withProviders(App);
