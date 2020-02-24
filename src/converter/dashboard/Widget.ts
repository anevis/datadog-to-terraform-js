import { BaseComponent } from './BaseComponent';
import { Request } from './Request';
import { TFObject } from './TFObject';

export enum WidgetType {
    ALERT_GRAPH = 'alert_graph',
    FREE_TEXT = 'free_text',
    GROUP = 'group',
    HOSTMAP = 'hostmap',
    TOPLIST = 'toplist',
    QUERY_VALUE = 'query_value',
    TIMESERIES = 'timeseries'
}

const TERRAFORM_DEFINITION = {
    [WidgetType.ALERT_GRAPH]: 'alert_graph_definition',
    [WidgetType.FREE_TEXT]: 'free_text_definition',
    [WidgetType.GROUP]: 'group_definition',
    [WidgetType.HOSTMAP]: 'hostmap_definition',
    [WidgetType.TOPLIST]: 'toplist_definition',
    [WidgetType.QUERY_VALUE]: 'query_value_definition',
    [WidgetType.TIMESERIES]: 'timeseries_definition'
};

class Layout {
    public readonly x: bigint;
    public readonly y: bigint;
    public readonly width: bigint;
    public readonly height: bigint;

    constructor(ddJson: any) {
        this.x = ddJson.x;
        this.y = ddJson.y;
        this.width = ddJson.width;
        this.height = ddJson.height;
    }

    public toTerraform(): string {
        return `layout = {x = ${this.x} y = ${this.y} width = ${this.width} height = ${this.height}}`;
    }
}

class Time extends BaseComponent {
    protected propertyNames(): string[] {
        return [];
    }

    toTerraform(): string {
        return `time = {${super.toTerraform()}}`;
    }
}

export class Widget extends BaseComponent {
    public readonly type: WidgetType;
    public readonly title: string;
    public readonly layout: Layout | undefined;
    public readonly requests: Request[];
    public readonly isSupported: boolean;
    public readonly widgets: Widget[];
    public readonly time?: Time;
    public readonly style?: TFObject;
    public readonly yaxis?: TFObject;

    private readonly widgetJson: any;

    public constructor(ddJson: any) {
        super(ddJson.definition);

        this.widgetJson = ddJson;
        this.type = ddJson.definition.type;
        this.isSupported = Object.values(WidgetType).includes(ddJson.definition.type);
        this.title = ddJson.definition.title;

        this.layout = this.initLayout();
        this.requests = this.initRequests();
        this.widgets = this.initWidgets();
        this.time = this.initTime();
        this.style = this.initTFObject('style');
        this.yaxis = this.initTFObject('yaxis');

        this.validate();
    }

    private initLayout(): Layout | undefined {
        if (this.widgetJson.layout !== undefined) {
            return new Layout(this.widgetJson.layout);
        }
        return undefined;
    }

    private initRequests(): Request[] {
        if (this.widgetJson.definition.requests instanceof Array) {
            return this.widgetJson.definition.requests.map((rJson: any) => {
                return new Request(rJson);
            });
        } else if (this.widgetJson.definition.requests !== undefined) {
            return [new Request(this.widgetJson.definition.requests)];
        }
        return [];
    }

    private initWidgets(): Widget[] {
        if (this.widgetJson.definition.widgets !== undefined) {
            return this.widgetJson.definition.widgets.map((wJson: any) => {
                return new Widget(wJson);
            });
        }
        return [];
    }

    private initTime(): Time | undefined {
        return this.widgetJson.definition.time ? new Time(this.widgetJson.definition.time) : undefined;
    }

    private initTFObject(name: string): TFObject | undefined {
        return this.widgetJson.definition[name] ? new TFObject(name, this.widgetJson.definition[name]) : undefined;
    }

    private validate(): void {
        if (this.type === WidgetType.GROUP && this.widgets.length === 0) {
            throw new Error('A group widget must have at least one widget within it.');
        }
    }

    protected propertyNames(): string[] {
        return ['requests', 'style', 'title', 'time', 'type', 'widgets', 'yaxis'];
    }

    public toTerraform(): string {
        let terraformStr = this.title ? `title = "${BaseComponent.formatString(this.title)}"` : '';
        const optionsStr = super.toTerraform();
        if (optionsStr.length > 0) {
            terraformStr += ` ${optionsStr}`;
        }
        terraformStr += `${this.requestsToTerraform()}`;
        if (this.time) {
            terraformStr += this.time.toTerraform();
        }
        if (this.style) {
            terraformStr += this.style.toTerraform();
        }
        if (this.yaxis) {
            terraformStr += this.yaxis.toTerraform();
        }

        const layoutStr = this.layout !== undefined ? ` ${this.layout.toTerraform()}` : '';

        return `widget {${TERRAFORM_DEFINITION[this.type]} {${terraformStr}${this.widgetsToTerraform()}}${layoutStr}}`;
    }

    private requestsToTerraform(): string {
        return this.requests.length > 0
            ? ' ' +
                  this.requests
                      .map((req: Request) => {
                          return req.toTerraform();
                      })
                      .join(' ')
            : '';
    }

    private widgetsToTerraform(): string {
        if (this.widgets.length > 0) {
            return (
                ' ' +
                this.widgets
                    .map((wg: Widget) => {
                        return wg.toTerraform();
                    })
                    .join(' ')
            );
        }
        return '';
    }
}
