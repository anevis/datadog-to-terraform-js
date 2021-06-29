import { Widget } from './Widget';
import { BaseComponent } from './BaseComponent';
import { TFObject } from './TFObject';

export enum LayoutType {
    FREE = 'free',
    ORDERED = 'ordered'
}

export class Dashboard extends BaseComponent {
    public readonly layoutType: LayoutType;
    public readonly notifyList: [string];
    public readonly widgets: Widget[];

    public readonly templateVariables: TFObject[];

    public constructor(jsonStr: string) {
        super(JSON.parse(jsonStr));

        this.layoutType = this.ddJson.layout_type;
        this.notifyList = this.ddJson.notify_list;
        this.widgets = this.initWidgets();
        this.templateVariables = this.initTemplateVariables();
    }

    private initWidgets(): Widget[] {
        if (this.ddJson.widgets) {
            return this.ddJson.widgets.map((dgWidgetJson: { [opt: string]: any }) => {
                return new Widget(dgWidgetJson);
            });
        }
        return [];
    }

    private initTemplateVariables(): TFObject[] {
        if (this.ddJson.template_variables) {
            return this.ddJson.template_variables.map((tempVar: { [key: string]: string }) => {
                return new TFObject('template_variable', tempVar);
            });
        }
        return [];
    }

    protected propertyNames(): string[] {
        return ['layout_type', 'notify_list', 'widgets', 'dashboard_id', 'template_variables', 'id'];
    }

    public toTerraform(): string {
        let terraformStr = `layout_type = "${this.layoutType}"`;
        if (this.notifyList !== undefined) {
            terraformStr += ` notify_list = [${this.notifyList
                .map((value: string) => {
                    return '"' + value + '"';
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
        return `resource "datadog_dashboard" "dashboard" {${super.toTerraform()} ${terraformStr}${this.templateVariablesToTerraform()}}`;
    }

    private templateVariablesToTerraform(): string {
        if (this.templateVariables.length > 0) {
            return (
                ' ' +
                this.templateVariables
                    .map((tempVar: TFObject) => {
                        return tempVar.toTerraform();
                    })
                    .join(' ')
            );
        }
        return '';
    }
}
