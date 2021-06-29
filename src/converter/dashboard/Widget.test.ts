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

        expect(widget.time).toEqual('1d');
    });

    it('Check the style does not exist', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.style).toBeUndefined();
    });

    it('Check the style can be imported from the JSON', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                style: {
                    palette: 'green_to_orange',
                    palette_flip: false,
                    fill_min: '43',
                    fill_max: '85'
                }
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.style).toBeDefined();
    });

    it('Check the yaxis does not exist', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                precision: 2
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.yaxis).toBeUndefined();
    });

    it('Check the yaxis can be imported from the JSON', () => {
        const ddJson = {
            id: 13,
            definition: {
                type: 'query_value',
                yaxis: {
                    max: 'auto',
                    include_zero: true
                }
            }
        };
        const widget = new Widget(ddJson);

        expect(widget.yaxis).toBeDefined();
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
