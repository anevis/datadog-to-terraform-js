import { BaseComponent } from './BaseComponent';

export class TFObject extends BaseComponent {
    public readonly name: string;
    public readonly assignmentNeeded: boolean;

    constructor(name: string, ddJson: { [opt: string]: any }, assignmentNeeded?: boolean) {
        super(ddJson);
        this.name = name;

        this.assignmentNeeded = !!assignmentNeeded;
    }

    protected propertyNames(): string[] {
        return [];
    }

    public toTerraform(): string {
        const assignmentChar = this.assignmentNeeded ? '= ' : '';
        return `${this.name} ${assignmentChar}{${super.toTerraform()}}`;
    }
}
