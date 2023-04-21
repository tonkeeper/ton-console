import { FunctionComponent } from 'react';

import { withProviders } from './providers';
import Routing from 'src/pages';
import { AppInitialization } from 'src/processes';

const App: FunctionComponent<void> = () => {
    return (
        <AppInitialization>
            <Routing />
        </AppInitialization>
    );
};

export default withProviders(App);
