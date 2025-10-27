import { FC } from 'react';

import { withProviders } from './providers';
import Routing from 'src/pages';
import { AppInitialization, ApplyQueryParams } from 'src/processes';
import FeedbackModal from 'src/features/feedback/FeedbackModal';

const App = () => {
    return (
        <AppInitialization>
            <ApplyQueryParams>
                <Routing />
                <FeedbackModal />
            </ApplyQueryParams>
        </AppInitialization>
    );
};

export default withProviders(App);
