import { shallow } from 'enzyme';
import React from 'react';

import { Footer } from './Footer';

const each = require('jest-each').default;

describe('Test Footer Component.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<Footer />);
    });
    each([['#dd-logo'], ['#tf-logo']]).it('Check that %s is rendered.', (sectionName: string) => {
        const app = shallow(<Footer />);
        expect(app.find(sectionName).length).toBe(1);
    });
});
