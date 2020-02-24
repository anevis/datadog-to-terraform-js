import { Widget, WidgetType } from './Widget';

const each = require('jest-each').default;

describe('Import Widget JSON.', () => {
    it('Check the Widget type and title can be imported from the JSON', () => {
        const ddJson = { definition: { type: 'timeseries', title: 'RDS CPU Utilisation' } };
        const widget = new Widget(ddJson);

        expect(widget.type).toBe(WidgetType.TIMESERIES);
        expect(widget.title).toBe('RDS CPU Utilisation');
    });

    each([
        [{ definition: { type: 'timeseries', title: 'RDS CPU Utilisation' } }, WidgetType.TIMESERIES, true],
        [{ definition: { type: 'free_text', title: 'RDS CPU Utilisation' } }, WidgetType.FREE_TEXT, true],
        [{ definition: { type: 'dummy', title: 'RDS CPU Utilisation' } }, 'dummy', false]
    ]).it(
        'When the type input is "%s"',
        (wJson: { [opt: string]: string }, expected: WidgetType, supported: boolean) => {
            const widget = new Widget(wJson);
            expect(widget.type).toBe(expected);
            expect(widget.isSupported).toBe(supported);
        }
    );

    it('Check the free text widget can be imported from the JSON', () => {
        const ddJson = {
            definition: {
                type: 'free_text'
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.type).toBe(WidgetType.FREE_TEXT);
        expect(widget.title).toBe(undefined);
    });

    it('Check the widget options can be imported from the JSON', () => {
        const ddJson = {
            definition: {
                type: 'free_text',
                text: 'RDS',
                color: '#774aa4',
                font_size: '56',
                text_align: 'left'
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.options).toEqual({
            text: 'RDS',
            color: '#774aa4',
            font_size: '56',
            text_align: 'left'
        });
    });

    it('Check the layout does not exist', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.layout).toBeUndefined();
    });

    it('Check the layout can be imported from the JSON', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2
            },
            layout: {
                x: 18,
                y: 39,
                width: 17,
                height: 7
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.layout?.x).toBe(18);
        expect(widget.layout?.y).toBe(39);
        expect(widget.layout?.width).toBe(17);
        expect(widget.layout?.height).toBe(7);
    });

    it('Check the requests does not exist', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.requests.length).toBe(0);
    });

    it('Check the requests (array) can be imported from the JSON', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2,
                requests: [
                    {
                        q: 'dummy-query',
                        aggregator: 'avg'
                    }
                ]
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.requests.length).toBe(1);
    });

    it('Check the requests (object) can be imported from the JSON', () => {
        const ddJson = {
            definition: {
                type: 'query_value',
                precision: 2,
                requests: {
                    aggregator: 'avg'
                }
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.requests.length).toBe(1);
    });

    it('Check the time can be imported from the JSON', () => {
        const ddJson = {
            definition: {
                type: 'query_value',
                precision: 2,
                time: {
                    live_span: '1d'
                }
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.time?.options).toEqual({ live_span: '1d' });
    });
});

describe('Import Group Widget JSON.', () => {
    it('Check sub-widgets can be imported from the JSON', () => {
        const ddJson = {
            definition: {
                type: 'group',
                layout_type: 'ordered',
                widgets: [
                    {
                        id: 8679795664442310,
                        definition: {
                            type: 'timeseries',
                            title: 'Avg of system.cpu.user',
                            show_legend: false,
                            legend_size: '0'
                        }
                    },
                    {
                        id: 5069049422494158,
                        definition: {
                            type: 'timeseries',
                            title: 'Avg of system.mem.free',
                            show_legend: false,
                            legend_size: '0'
                        }
                    }
                ],
                title: 'Application Servers'
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.type).toBe(WidgetType.GROUP);
        expect(widget.widgets.length).toBe(2);
    });

    it('Fail when no sub-widgets are specified', () => {
        const ddJson = {
            definition: {
                type: 'group',
                layout_type: 'ordered',
                title: 'Application Servers'
            }
        };

        expect(function() {
            new Widget(ddJson);
        }).toThrow(new Error('A group widget must have at least one widget within it.'));
    });
});

describe('Construct Widget terraform.', () => {
    it('Construct Request terraform with options and title.', () => {
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

    it('Construct Request terraform with request.', () => {
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

    it('Construct Request terraform with layout.', () => {
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

    it('Construct Request terraform with sub-widgets.', () => {
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

    it('Construct Request terraform with time', () => {
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
});
