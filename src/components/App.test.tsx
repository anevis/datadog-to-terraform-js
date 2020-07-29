import { shallow } from 'enzyme';
import React from 'react';

import App from './App';
import Converter from './Converter';
import Header from './Header';
import Footer from './Footer';

test('renders without crashing', () => {
    shallow(<App />);
});

test.each([
    ['Converter', Converter],
    ['Header', Header],
    ['Footer', Footer]
])('Check the %s section is rendered.', (sectionName: string, section: React.FC) => {
    const app = shallow(<App />);
    expect(app.find(section).length).toBe(1);
});
