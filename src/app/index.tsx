import { withProviders } from './providers';
import Routing from 'src/pages';
import { AppInitialization, ApplyQueryParams } from 'src/processes';
import { FeedbackModal, FeedbackModalProvider } from 'src/features/feedback';

const App = () => {
    return (
        <AppInitialization>
            <ApplyQueryParams>
                <FeedbackModalProvider>
                    <Routing />
                    <FeedbackModal />
                </FeedbackModalProvider>
            </ApplyQueryParams>
        </AppInitialization>
    );
};

export default withProviders(App);
