import { shallow } from 'enzyme';
import React from 'react';

import { App } from './App';
import { Converter } from './Converter';
import { Header } from './Header';
import { Footer } from './Footer';

const each = require('jest-each').default;

describe('Test main screen.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<App />);
    });

    each([
        ['Converter', Converter],
        ['Header', Header],
        ['Footer', Footer]
    ]).it('Check the %s section is rendered.', (sectionName: string, section: React.PureComponent) => {
        const app = shallow(<App />);
        expect(app.find(section).length).toBe(1);
    });
});
