export enum Comparator {
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL_TO = '<=',
    GREATER_THAN = '>',
    GREATER_THAN_OR_EQUAL_TO = '>=',
    EQUAL_TO = '='
}

export type ConditionalFormatInputType = { [opt: string]: string | number };

export class ConditionalFormat {
    public readonly comparator: Comparator;
    public readonly value: number;
    public readonly palette: string;

    public constructor(ddJson: ConditionalFormatInputType) {
        this.comparator = ddJson.comparator as Comparator;
        this.value = ddJson.value as number;
        this.palette = ddJson.palette as string;
    }

    public toTerraform(): string {
        return (
            'conditional_formats {comparator =' +
            ` "${this.comparator}" value = "${this.value}" palette = "${this.palette}"}`
        );
    }
}
