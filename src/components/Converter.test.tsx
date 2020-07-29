import { mount, shallow } from 'enzyme';
import React from 'react';
import Converter from './Converter';
import CopyToClipboard from 'react-copy-to-clipboard';
import Switch from '@material-ui/core/Switch';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
const ddJson = '{"title": "My board", "layout_type": "free"}';

test('renders without crashing with enzyme', () => {
    shallow(<Converter />);
});

test.each([
    ['JSON', '#dd-json'],
    ['Terraform', '#dd-terraform'],
    ['Datadog Logo', '#dd-logo'],
    ['Terraform Logo', '#tf-logo']
])('Check that %s component is rendered.', (name: string, field: string) => {
    const converter = shallow(<Converter />);
    expect(converter.find(field).length).toBe(1);
});

test('Check that Pretty Print Form Control component is rendered.', () => {
    const converter = shallow(<Converter />);
    expect(converter.find(Switch).length).toBe(1);
});

test('Check that Copy to Clipboard component is rendered.', () => {
    const converter = shallow(<Converter />);
    expect(converter.find(CopyToClipboard).length).toBe(1);
});

test('Check the JSON is converted and pretty printed by default.', () => {
    const converter = mount(<Converter />);
    const jsonField = converter.find('#dd-json');

    jsonField.simulate('change', { target: { value: ddJson } });
    expect(converter.find('#dd-terraform').prop('children')).toBe(
        'resource "datadog_dashboard" "dashboard" {\n  title = "My board" layout_type = "free"\n}\n'
    );
});

test('Check the JSON error condition.', () => {
    const converter = mount(<Converter />);
    const jsonField = converter.find('#dd-json');

    jsonField.simulate('change', { target: { value: 'invalid JSON' } });
    expect(converter.find(MuiAlert).text()).toBe('Unexpected token i in JSON at position 0');
    expect(converter.find('#dd-terraform').prop('children')).toBeUndefined();
});

test('Check the JSON is converted and not pretty printed when pretty print checkbox is clicked.', () => {
    const converter = mount(<Converter />);
    const jsonField = converter.find('#dd-json');
    const prettyPrint = converter.find('input#dd-terraform-pretty-print');

    prettyPrint.simulate('change', { checked: true });
    jsonField.simulate('change', { target: { value: ddJson } });
    expect(converter.find('#dd-terraform').prop('children')).toBe(
        'resource "datadog_dashboard" "dashboard" {title = "My board" layout_type = "free"}'
    );
});

test('On copy button click.', () => {
    const converter = shallow(<Converter />);
    const copyBtn = converter.find('#btn-copy-terraform');

    copyBtn.simulate('click');
    expect(converter.find(Snackbar).prop('open')).toBeTruthy();
});
