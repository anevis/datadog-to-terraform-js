import { shallow } from 'enzyme';
import React from 'react';

import { App } from './App';
import { Converter } from './Converter';
import { Header } from './Header';

const each = require('jest-each').default;

describe('Test main screen.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<App />);
    });

    each([[Converter], [Header]]).it('Check the given sections are rendered.', (sectionName: string) => {
        const app = shallow(<App />);
        expect(app.find(sectionName).length).toBe(1);
    });
});
