import { Request } from './Request';

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

    it('Construct Request terraform with metadata quotes.', () => {
        const ddJson = {
            metadata: [
                {
                    expression: 'dummy expression with "quotes"',
                    alias_name: '200'
                }
            ]
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe(
            'request { metadata {expression = "dummy expression with \\"quotes\\"" alias_name = "200"}}'
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

    it('Construct Request terraform with quotes in query.', () => {
        const ddJson = {
            q: 'dummy-query with "quotes"'
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe('request {q = "dummy-query with \\"quotes\\""}');
    });

    it('Construct Request terraform with query inside a fill param', () => {
        const ddJson = {
            fill: {
                q: 'dummy-query'
            }
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe('request {fill {q = "dummy-query"}}');
    });

    it('Construct Request terraform with log query', () => {
        const ddJson = {
            log_query: {
                index: 'main',
                compute: {
                    aggregation: 'max'
                }
            }
        };
        const request = new Request(ddJson);

        const terraformStr = request.toTerraform();

        expect(terraformStr).toBe('request { log_query {index = "main" compute_query {aggregation = "max"}}}');
    });
});
