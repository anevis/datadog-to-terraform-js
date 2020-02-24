import { Widget } from './Widget';
import { BaseComponent } from './BaseComponent';

export enum LayoutType {
    FREE = 'free',
    ORDERED = 'ordered'
}

export class Dashboard extends BaseComponent {
    public readonly layoutType: LayoutType;
    public readonly notifyList: [string];
    public readonly widgets: Widget[];

    public constructor(jsonStr: string) {
        super(JSON.parse(jsonStr));

        this.layoutType = this.ddJson.layout_type;
        this.notifyList = this.ddJson.notify_list;
        this.widgets = this.initWidgets();
    }

    private initWidgets(): Widget[] {
        if (this.ddJson.widgets) {
            return this.ddJson.widgets.map((dgWidgetJson: { [opt: string]: any }) => {
                return new Widget(dgWidgetJson);
            });
        }
        return [];
    }

    protected propertyNames(): string[] {
        return ['layout_type', 'notify_list', 'widgets', 'dashboard_id'];
    }

    public toTerraform(): string {
        let terraformStr = `layout_type = "${this.layoutType}"`;
        if (this.notifyList !== undefined) {
            terraformStr += ` notify_list = [${this.notifyList
                .map((value: string) => {
                    return `"${value}"`;
                })
                .join(' ')}]`;
        }
        if (this.widgets.length > 0) {
            terraformStr +=
                ' ' +
                this.widgets
                    .map((wg: Widget) => {
                        return wg.toTerraform();
                    })
                    .join(' ');
        }
        return `resource "datadog_dashboard" "dashboard" {${super.toTerraform()} ${terraformStr}}`;
    }
}
