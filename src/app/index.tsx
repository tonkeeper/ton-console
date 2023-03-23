import { FunctionComponent } from 'react';

import { withProviders } from './providers';
import Routing from 'src/pages';
const App: FunctionComponent<void> = () => {
    return <Routing />;
};

export default withProviders(App);
