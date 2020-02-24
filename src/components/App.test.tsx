import { mount, shallow } from 'enzyme';
import React from 'react';

import { App } from './App';

describe('Test main screen.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<App />);
    });

    it('Check the dd-json field is rendered.', () => {
        const app = shallow(<App />);
        expect(app.find('#dd-json').length).toBe(1);
    });

    it('Check the dd-terraform field is rendered.', () => {
        const app = shallow(<App />);
        expect(app.find('#dd-terraform').length).toBe(1);
    });

    it('Check the copy to clipboard is displayed field is rendered.', () => {
        const app = shallow(<App />);
        expect(app.find('CopyToClipboard').length).toBe(1);
    });

    it('Check the dd-terraform-show-pretty field is rendered.', () => {
        const app = shallow(<App />);
        expect(app.find('#dd-terraform-pretty-print').length).toBe(1);
    });

    const ddJson = '{"title": "My board", "layout_type": "free"}';
    it('Check the JSON is converted.', () => {
        const app = mount(<App />);
        const jsonField = app.find('#dd-json');

        app.setState({ prettyPrint: false });
        jsonField.simulate('change', { target: { value: ddJson } });
        expect(app.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My board" layout_type = "free"}'
        );
    });

    it('Check the JSON error condition.', () => {
        const app = mount(<App />);
        const jsonField = app.find('#dd-json');
        jsonField.simulate('change', { target: { value: 'invalid JSON' } });
        expect(app.find('#dd-json-error').prop('children')).toBe('Unexpected token i in JSON at position 0');
        expect(app.find('#dd-terraform').prop('children')).toBeUndefined();
    });

    it('Check the JSON is converted and pretty printed.', () => {
        const app = mount(<App />);
        const jsonField = app.find('#dd-json');

        jsonField.simulate('change', { target: { value: ddJson } });
        expect(app.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {\n  title = "My board" layout_type = "free"\n}\n'
        );
    });

    it('Check the JSON is converted and pretty printed when pretty print checkbox is clicked.', () => {
        const app = mount(<App jsonStr={ddJson} />);
        const pretyPrint = app.find('#dd-terraform-pretty-print');
        app.setState({ prettyPrint: false });

        pretyPrint.simulate('change', { checked: true });
        expect(app.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {\n  title = "My board" layout_type = "free"\n}\n'
        );
    });
});
