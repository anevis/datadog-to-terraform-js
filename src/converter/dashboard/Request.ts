import { ConditionalFormat } from './ConditionalFormat';
import { BaseComponent } from './BaseComponent';
import { TFObject } from './TFObject';
import { LogQuery } from './LogQuery';

class Metadata {
    public readonly expression: string;
    public readonly aliasName: string;

    constructor(ddJson: { [opt: string]: string }) {
        this.expression = ddJson.expression;
        this.aliasName = ddJson.alias_name;
    }

    public toTerraform(): string {
        return (
            `metadata {expression = "${BaseComponent.formatString(this.expression)}"` +
            ` alias_name = "${this.aliasName}"}`
        );
    }
}

export class Request extends BaseComponent {
    public readonly query: string | undefined;
    public readonly conditionalFormat: ConditionalFormat[];
    public readonly metadata: Metadata[];
    public readonly style: TFObject | undefined;
    public readonly logQuery: LogQuery | undefined;

    private readonly requestDdJson: { [opt: string]: any };

    public constructor(ddJson: { [opt: string]: any }) {
        super(ddJson);

        this.requestDdJson = ddJson;
        this.query = this.initQuery();
        this.conditionalFormat = this.initConditionalFormat();
        this.metadata = this.initMetadata();
        this.style = this.initStyle();
        this.logQuery = this.initLogQuery();
    }

    private initQuery(): string | undefined {
        if (this.requestDdJson.fill !== undefined) {
            return this.requestDdJson.fill.q;
        } else if (this.requestDdJson.q !== undefined) {
            return this.requestDdJson.q;
        }
        return undefined;
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

    private initStyle(): TFObject | undefined {
        if (this.requestDdJson.style !== undefined) {
            return new TFObject('style', this.requestDdJson.style);
        }
        return undefined;
    }

    private initLogQuery(): LogQuery | undefined {
        if (this.requestDdJson.log_query !== undefined) {
            return new LogQuery(this.requestDdJson.log_query);
        }
        return undefined;
    }

    protected propertyNames(): string[] {
        return ['q', 'conditional_formats', 'style', 'metadata', 'fill', 'log_query'];
    }

    public toTerraform(): string {
        return (
            `request {${this.queryToTerraform()}${this.logQueryToTerraform()}${this.optionsToTerraform()}${this.metadataToTerraform()}` +
            `${this.styleToTerraform()}${this.conditionalFormatToTerraform()}}`
        );
    }

    private queryToTerraform(): string {
        if (this.query !== undefined) {
            const queryStr = `q = "${BaseComponent.formatString(this.query)}"`;
            if (this.requestDdJson.fill !== undefined) {
                return `fill {${queryStr}}`;
            } else {
                return queryStr;
            }
        }
        return '';
    }

    private logQueryToTerraform(): string {
        if (this.logQuery) {
            return ' ' + this.logQuery.toTerraform();
        }
        return '';
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
