import { shallow } from 'enzyme';
import React from 'react';

import Header from './Header';

test('renders without crashing', () => {
    shallow(<Header />);
});
