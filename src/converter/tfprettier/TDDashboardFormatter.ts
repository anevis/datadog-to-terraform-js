import { TFBaseComponentFormatter } from './TFBaseComponentFormatter';
import { BaseComponent } from '../dashboard/BaseComponent';
import { Dashboard } from '../dashboard/Dashboard';

export class TFDashboardFormatter extends TFBaseComponentFormatter<Dashboard> {
    public constructor(tfObject: BaseComponent, prettyPrint = false, indent = 0) {
        super(tfObject, 1, prettyPrint, indent);
    }

    format(): string {
        let formattedStr = `layout_type = "${this.tfObject.layoutType}"`;
        if (this.prettyPrint) {
            formattedStr = `\n${this.getIndent()}${formattedStr}`;
        }
        if (super.format().length > 0) {
            formattedStr += this.formatOptions();
        }
        formattedStr += `${this.formatNotifyList()}`;
        if (this.prettyPrint) {
            formattedStr += '\n';
        }
        return `resource "datadog_dashboard" "dashboard" {${formattedStr}}`;
    }

    private formatNotifyList(): string {
        if (this.tfObject.notifyList !== undefined) {
            return `${this.getPrefix()}notify_list = [${this.tfObject.notifyList
                .map((value: string) => {
                    return `"${value}"`;
                })
                .join(' ')}]`;
        }
        return '';
    }

    private formatOptions(): string {
        if (this.prettyPrint) {
            return `\n${super.format()}`;
        }
        return ` ${super.format()}`;
    }

    private getPrefix(): string {
        if (this.prettyPrint) {
            return `\n${this.getIndent()}`;
        }
        return ' ';
    }
}
