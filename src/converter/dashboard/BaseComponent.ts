export abstract class BaseComponent {
    public readonly options: { [opt: string]: string | number | boolean | string[] };

    protected readonly ddJson: { [key: string]: any };

    protected constructor(ddJson: { [key: string]: any }) {
        this.ddJson = ddJson;

        this.options = this.initOptions();
    }

    /**
     * Initialise the supported options.
     */
    private initOptions(): { [key: string]: string | number | boolean } {
        const opts: { [key: string]: string | number | boolean } = {};
        for (const opt of Object.keys(this.ddJson)) {
            if (this.ddJson.hasOwnProperty(opt) && !this.propertyNames().includes(opt)) {
                opts[opt] = this.ddJson[opt];
            }
        }
        return opts;
    }

    /**
     * Get a list of options that are properties. These will not be added to {this.options}.
     */
    protected abstract propertyNames(): string[];

    public toTerraform(): string {
        const optionList: string[] = [];
        for (const opt of Object.keys(this.options)) {
            optionList.push(`${this.optionToTerraform(opt)}`);
        }
        return optionList.join(' ');
    }

    /**
     * Convert the given option value to terraform depending on it's type.
     *
     * @param opt The option to convert to terraform string.
     * @return The terraform string.
     */
    private optionToTerraform(opt: string): string {
        const value = this.options[opt];
        if (['boolean', 'number'].includes(typeof value)) {
            return `${opt} = ${this.options[opt]}`;
        } else if (value instanceof Array) {
            const valuesStr = (this.options[opt] as string[])
                .map((val: string) => {
                    return `"${this.formatString(val)}"`;
                })
                .join(', ');
            return `${opt} = [${valuesStr}]`;
        }
        return `${opt} = "${this.formatString(value)}"`;
    }

    protected formatString(value: any): string {
        if (typeof value === 'string' && value.includes('"')) {
            return value.split('"').join('\\"');
        }
        return value;
    }
}
