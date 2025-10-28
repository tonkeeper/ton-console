import compose from 'compose-function';
import { withRouter } from './with-router';
import { withChakra } from './with-chakra';
import { withTonConnectUI } from './with-ton-connect-ui';
import { withReactQuery } from './with-react-query';
import { withProjectId } from './with-project-id';
import './with-mobx';

export const withProviders = compose(withChakra, withRouter, withTonConnectUI, withReactQuery, withProjectId);
