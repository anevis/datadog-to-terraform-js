import { Request } from './Request';

describe('Import request JSON.', () => {
    it('Check the request properties can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg'
        };
        const request = new Request(ddJson);

        expect(request.query).toBe('dummy-query');
        expect(request.conditionalFormat.length).toBe(0);
    });

    it('Check the request options can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy'
        };
        const request = new Request(ddJson);

        expect(request.options).toEqual({
            aggregator: 'avg',
            display_type: 'dummy'
        });
    });

    it('Check the request options do not have other properties.', () => {
        const ddJson = {
            q: 'dummy-query',
            conditional_formats: [
                {
                    comparator: '<',
                    value: 0.5,
                    palette: 'white_on_green'
                }
            ],
            style: {
                palette: 'cool',
                line_type: 'solid',
                line_width: 'normal'
            },
            metadata: [
                {
                    expression: 'dummy expression',
                    alias_name: '200'
                }
            ]
        };
        const request = new Request(ddJson);

        expect(request.options).toEqual({});
    });

    it('Check the conditional format is empty', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg'
        };
        const request = new Request(ddJson);

        expect(request.conditionalFormat.length).toBe(0);
    });

    it('Check the conditional format properties can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            conditional_formats: [
                {
                    comparator: '<',
                    value: 0.5,
                    palette: 'white_on_green'
                },
                {
                    comparator: '>=',
                    value: 0.5,
                    palette: 'white_on_yellow'
                }
            ]
        };
        const request = new Request(ddJson);

        expect(request.conditionalFormat.length).toBe(2);
    });

    it('Check that request metadata is empty', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy'
        };
        const request = new Request(ddJson);

        expect(request.metadata.length).toBe(0);
    });

    it('Check that request metadata can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            metadata: [
                {
                    expression: 'dummy expression',
                    alias_name: '200'
                }
            ]
        };
        const request = new Request(ddJson);

        expect(request.metadata.length).toBe(1);
        expect(request.metadata[0].expression).toBe('dummy expression');
        expect(request.metadata[0].aliasName).toBe('200');
    });

    it('Check that request style is undefined', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy'
        };
        const request = new Request(ddJson);

        expect(request.style).toBeUndefined();
    });

    it('Check that request style can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            style: {
                palette: 'cool',
                line_type: 'solid',
                line_width: 'normal'
            }
        };
        const request = new Request(ddJson);

        expect(request.style?.palette).toBe('cool');
        expect(request.style?.lineType).toBe('solid');
        expect(request.style?.lineWidth).toBe('normal');
    });

    it('Check that request style with only palette can be imported from the JSON', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            style: {
                palette: 'cool'
            }
        };
        const request = new Request(ddJson);

        expect(request.style?.palette).toBe('cool');
        expect(request.style?.lineType).toBeUndefined();
        expect(request.style?.lineWidth).toBeUndefined();
    });

    it('Check that request query inside a fill param can be imported from the JSON', () => {
        const ddJson = {
            fill: {
                q: 'dummy-query'
            }
        };
        const request = new Request(ddJson);

        expect(request.query).toBe('dummy-query');
    });
});

describe('Construct Request terraform.', () => {
    it('Construct Request terraform with conditional formats.', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            conditional_formats: [
                {
                    comparator: '<',
                    value: 0.5,
                    palette: 'white_on_green'
                },
                {
                    comparator: '>=',
                    value: 100,
                    palette: 'white_on_yellow'
                }
            ]
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe(
            'request {q = "dummy-query" aggregator = "avg" display_type = "dummy"' +
                ' conditional_formats {comparator = "<" value = "0.5" palette = "white_on_green"}' +
                ' conditional_formats {comparator = ">=" value = "100" palette = "white_on_yellow"}}'
        );
    });

    it('Construct Request terraform with style.', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            style: {
                palette: 'cool',
                line_type: 'solid',
                line_width: 'normal'
            }
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe(
            'request {q = "dummy-query" aggregator = "avg" display_type = "dummy"' +
                ' style {palette = "cool" line_type = "solid" line_width = "normal"}}'
        );
    });

    it('Construct Request terraform with metadata.', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            metadata: [
                {
                    expression: 'dummy expression',
                    alias_name: '200'
                }
            ]
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe(
            'request {q = "dummy-query" aggregator = "avg" display_type = "dummy"' +
                ' metadata {expression = "dummy expression" alias_name = "200"}}'
        );
    });

    it('Construct Request terraform no style, conditional formats, style and metadata.', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy'
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe('request {q = "dummy-query" aggregator = "avg" display_type = "dummy"}');
    });

    it('Construct Request terraform style with only palette.', () => {
        const ddJson = {
            q: 'dummy-query',
            aggregator: 'avg',
            display_type: 'dummy',
            style: {
                palette: 'cool'
            }
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe(
            'request {q = "dummy-query" aggregator = "avg" display_type = "dummy"' + ' style {palette = "cool"}}'
        );
    });

    it('Construct Request terraform no options.', () => {
        const ddJson = {
            q: 'dummy-query'
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe('request {q = "dummy-query"}');
    });
});
