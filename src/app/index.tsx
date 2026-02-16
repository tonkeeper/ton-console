import { withProviders } from './providers';
import Routing from 'src/pages';
import { ApplyQueryParams } from 'src/processes';
import { FeedbackModal, FeedbackModalProvider } from 'src/features/feedback';

const App = () => {
    return (
        <ApplyQueryParams>
            <FeedbackModalProvider>
                <Routing />
                <FeedbackModal />
            </FeedbackModalProvider>
        </ApplyQueryParams>
    );
};

export default withProviders(App);
