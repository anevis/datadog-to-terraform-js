import { mount, shallow } from 'enzyme';
import React from 'react';

import { Converter } from './Converter';
import { toast } from 'react-toastify';

const each = require('jest-each').default;

describe('Test Converter Component.', () => {
    it('renders without crashing with enzyme', () => {
        shallow(<Converter />);
    });

    each([
        ['#dd-json'],
        ['#dd-terraform'],
        ['#dd-terraform-pretty-print'],
        ['CopyToClipboard'],
        ['#dd-logo'],
        ['#tf-logo']
    ]).it('Check the given fields/sections are rendered.', (fieldName: string) => {
        const converter = shallow(<Converter />);
        expect(converter.find(fieldName).length).toBe(1);
    });

    const ddJson = '{"title": "My board", "layout_type": "free"}';
    it('Check the JSON is converted.', () => {
        const converter = mount(<Converter />);
        const jsonField = converter.find('#dd-json');

        converter.setState({ prettyPrint: false });
        jsonField.simulate('change', { target: { value: ddJson } });
        expect(converter.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My board" layout_type = "free"}'
        );
    });

    it('Check the JSON error condition.', () => {
        const converter = mount(<Converter />);
        const jsonField = converter.find('#dd-json');
        jsonField.simulate('change', { target: { value: 'invalid JSON' } });
        expect(converter.find('#dd-json-error').prop('children')).toBe('Unexpected token i in JSON at position 0');
        expect(converter.find('#dd-terraform').prop('children')).toBeUndefined();
    });

    it('Check the JSON is converted and pretty printed.', () => {
        const converter = mount(<Converter />);
        const jsonField = converter.find('#dd-json');

        jsonField.simulate('change', { target: { value: ddJson } });
        expect(converter.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {\n  title = "My board" layout_type = "free"\n}\n'
        );
    });

    it('Check the JSON is converted and pretty printed when pretty print checkbox is clicked.', () => {
        const converter = mount(<Converter jsonStr={ddJson} />);
        const pretyPrint = converter.find('#dd-terraform-pretty-print');
        converter.setState({ prettyPrint: false });

        pretyPrint.simulate('change', { checked: true });
        expect(converter.find('#dd-terraform').prop('children')).toBe(
            'resource "datadog_dashboard" "dashboard" {\n  title = "My board" layout_type = "free"\n}\n'
        );
    });

    it('On copy button click.', () => {
        toast.success = jest.fn();
        const converter = shallow(<Converter jsonStr={ddJson} />);
        const copyBtn = converter.find('#btn-copy-terraform');

        copyBtn.simulate('click');

        expect(toast.success).toHaveBeenCalledWith('Terraform successfully copied.', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    });
});
