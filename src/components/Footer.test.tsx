import { shallow } from 'enzyme';
import React from 'react';

import Footer from './Footer';

test('renders without crashing', () => {
    shallow(<Footer />);
});

test.each([['#dd-logo'], ['#tf-logo']])('Check that %s is rendered.', (sectionName: string) => {
    const app = shallow(<Footer />);
    expect(app.find(sectionName).length).toBe(1);
});
