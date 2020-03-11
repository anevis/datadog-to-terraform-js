import { BaseComponent } from '../dashboard/BaseComponent';

export class TFBaseComponentFormatter<C extends BaseComponent> {
    protected readonly tfObject: C;
    protected readonly prettyPrint: boolean;
    private readonly indent: number;
    private readonly depth: number;

    public constructor(tfObject: C, depth = 1, prettyPrint = false, indent = 0) {
        this.tfObject = tfObject;
        this.depth = depth;
        this.prettyPrint = prettyPrint;
        this.indent = indent;
    }

    public format(): string {
        const optionList: string[] = [];
        for (const opt of Object.keys(this.tfObject.options)) {
            optionList.push(
                `${this.getIndent()}${opt} = ${TFBaseComponentFormatter.formatOption(this.tfObject.options[opt])}`
            );
        }

        if (this.prettyPrint) {
            return optionList.join('\n');
        } else {
            return optionList.join(' ');
        }
    }

    private static formatOption(value: string | number | boolean | string[]): string {
        if (['boolean', 'number'].includes(typeof value)) {
            return `${value}`;
        } else if (value instanceof Array) {
            const valuesStr = (value as string[])
                .map((val: string) => {
                    return `"${TFBaseComponentFormatter.escapeString(val)}"`;
                })
                .join(', ');
            return `[${valuesStr}]`;
        }
        return `"${TFBaseComponentFormatter.escapeString(value as string)}"`;
    }

    protected getIndent(): string {
        if (this.indent > 0) {
            return ' ' + Array(this.indent * this.depth).join(' ');
        }
        return '';
    }

    /**
     * Format the given string e.g. add escape character before quotes.
     *
     * @param value The string value to format.
     * @return The formatted value.
     */
    private static escapeString(value: string): string {
        return value.split('"').join('\\"');
    }
}
