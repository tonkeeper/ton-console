import compose from 'compose-function';
import { withRouter } from './with-router';
import { withChakra } from './with-chakra';
// import { withTonConnectUI } from './with-ton-connect-ui';
import './with-i18';
import './with-mobx';

export const withProviders = compose(withChakra, withRouter);
