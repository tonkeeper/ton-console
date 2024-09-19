import React from 'react';
import { render } from '@testing-library/react';

import App from '../../src/app';

describe('App', () => {
    it('Should be rendered', () => {
        expect(() => render(<App />)).not.toThrow();
    });
});
