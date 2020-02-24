import { Widget, WidgetType } from './Widget';

describe('Construct Widget terraform.', () => {
    it('Construct Widget terraform with options and title.', () => {
        const ddJson = {
            definition: {
                title: 'Test title',
                type: WidgetType.QUERY_VALUE,
                title_size: 'T Title Size',
                title_align: 'T Title align'
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe(
            'widget {query_value_definition {title = "Test title" title_size = "T Title Size"' +
                ' title_align = "T Title align"}}'
        );
    });

    it('Construct Widget terraform with title having escaped double quotes', () => {
        const ddJson = {
            definition: {
                title: '@path over \\"service:xplan @path:*\\"',
                type: 'query_value'
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe(
            'widget {query_value_definition {title = "@path over \\\\"service:xplan @path:*\\\\""}}'
        );
    });

    it('Construct Widget terraform with request.', () => {
        const ddJson = {
            definition: {
                title: 'Test title',
                type: WidgetType.QUERY_VALUE,
                requests: [{ q: 'testing q' }]
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe('widget {query_value_definition {title = "Test title" request {q = "testing q"}}}');
    });

    it('Construct Widget terraform with layout.', () => {
        const ddJson = {
            definition: {
                title: 'Test title',
                type: WidgetType.QUERY_VALUE
            },
            layout: {
                x: 0,
                y: 10,
                width: 20,
                height: 50
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe(
            'widget {query_value_definition {title = "Test title"} layout = {x = 0 y = 10 width = 20 height = 50}}'
        );
    });

    it('Construct Widget terraform with sub-widgets.', () => {
        const ddJson = {
            definition: {
                title: 'Test title',
                type: WidgetType.GROUP,
                layout_type: 'ordered',
                widgets: [
                    {
                        definition: {
                            type: 'hostmap',
                            title: 'Global Host Map'
                        }
                    },
                    {
                        definition: {
                            type: 'toplist',
                            title: 'Global Top List'
                        }
                    }
                ]
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe(
            'widget {group_definition {title = "Test title" layout_type = "ordered"' +
                ' widget {hostmap_definition {title = "Global Host Map"}}' +
                ' widget {toplist_definition {title = "Global Top List"}}}}'
        );
    });

    it('Construct Widget terraform with time', () => {
        const ddJson = {
            definition: {
                type: 'query_value',
                time: {
                    live_span: '1d'
                }
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe('widget {query_value_definition {time = {live_span = "1d"}}}');
    });

    it('Construct Widget terraform with style', () => {
        const ddJson = {
            definition: {
                type: 'query_value',
                style: {
                    palette: 'green_to_orange'
                }
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe('widget {query_value_definition {style {palette = "green_to_orange"}}}');
    });

    it('Construct Widget terraform with yaxis', () => {
        const ddJson = {
            definition: {
                type: 'query_value',
                yaxis: {
                    include_zero: true
                }
            }
        };
        const widget = new Widget(ddJson);

        const terraformStr = widget.toTerraform();

        expect(terraformStr).toBe('widget {query_value_definition {yaxis {include_zero = true}}}');
    });
});
