import { shallow } from 'enzyme';
import React from 'react';

import { Header } from './Header';

describe('Test Header Component.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<Header />);
    });
});
