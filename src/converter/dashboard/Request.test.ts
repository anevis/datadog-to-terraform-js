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

        expect(request.style?.options).toEqual({
            palette: 'cool',
            line_type: 'solid',
            line_width: 'normal'
        });
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

    it('Check that request log_query can be imported from the JSON', () => {
        const ddJson = {
            log_query: {
                index: 'main',
                compute: {
                    aggregation: 'max',
                    facet: '@response_time'
                }
            }
        };
        const request = new Request(ddJson);

        expect(request.logQuery).toBeDefined();
    });
});
