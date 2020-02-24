import { ConditionalFormat } from './ConditionalFormat';
import { BaseComponent } from './BaseComponent';

class Metadata {
    public readonly expression: string;
    public readonly aliasName: string;

    constructor(ddJson: { [opt: string]: string }) {
        this.expression = ddJson.expression;
        this.aliasName = ddJson.alias_name;
    }

    public toTerraform(): string {
        return `metadata {expression = "${this.expression}" alias_name = "${this.aliasName}"}`;
    }
}

class Style {
    public readonly palette: string;
    public readonly lineType: string;
    public readonly lineWidth: string;

    constructor(ddJson: { [opt: string]: string }) {
        this.palette = ddJson.palette;
        this.lineType = ddJson.line_type;
        this.lineWidth = ddJson.line_width;
    }

    public toTerraform(): string {
        let terraformStr = `palette = "${this.palette}"`;
        if (this.lineType) {
            terraformStr += ` line_type = "${this.lineType}"`;
        }
        if (this.lineType) {
            terraformStr += ` line_width = "${this.lineWidth}"`;
        }
        return `style {${terraformStr}}`;
    }
}

export class Request extends BaseComponent {
    public readonly query: string;
    public readonly conditionalFormat: ConditionalFormat[];
    public readonly metadata: Metadata[];
    public readonly style: Style | undefined;

    private readonly requestDdJson: { [opt: string]: any };

    public constructor(ddJson: { [opt: string]: any }) {
        super(ddJson);

        this.requestDdJson = ddJson;
        this.query = ddJson.fill !== undefined ? ddJson.fill.q : ddJson.q;
        this.conditionalFormat = this.initConditionalFormat();
        this.metadata = this.initMetadata();
        this.style = this.initStyle();
    }

    private initConditionalFormat(): ConditionalFormat[] {
        if (this.requestDdJson.conditional_formats !== undefined) {
            return this.requestDdJson.conditional_formats.map((cfJson: {}) => {
                return new ConditionalFormat(cfJson);
            });
        }
        return [];
    }

    private initMetadata(): Metadata[] {
        if (this.requestDdJson.metadata !== undefined) {
            return this.requestDdJson.metadata.map((mdJson: {}) => {
                return new Metadata(mdJson);
            });
        }
        return [];
    }

    private initStyle(): Style | undefined {
        if (this.requestDdJson.style !== undefined) {
            return new Style(this.requestDdJson.style);
        }
        return undefined;
    }

    protected propertyNames(): string[] {
        return ['q', 'conditional_formats', 'style', 'metadata'];
    }

    public toTerraform(): string {
        return (
            `request {q = "${this.query}"${this.optionsToTerraform()}${this.metadataToTerraform()}` +
            `${this.styleToTerraform()}${this.conditionalFormatToTerraform()}}`
        );
    }

    private optionsToTerraform(): string {
        const optionsStr = super.toTerraform();
        return optionsStr.length > 0 ? ` ${optionsStr}` : '';
    }

    private metadataToTerraform(): string {
        if (this.metadata.length > 0) {
            return (
                ' ' +
                this.metadata
                    .map((md: Metadata) => {
                        return md.toTerraform();
                    })
                    .join(' ')
            );
        }
        return '';
    }

    private styleToTerraform(): string {
        if (this.style) {
            return ' ' + this.style?.toTerraform();
        }
        return '';
    }

    private conditionalFormatToTerraform(): string {
        if (this.conditionalFormat.length > 0) {
            return (
                ' ' +
                this.conditionalFormat
                    .map((cf: ConditionalFormat) => {
                        return cf.toTerraform();
                    })
                    .join(' ')
            );
        }
        return '';
    }
}
