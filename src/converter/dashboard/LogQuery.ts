import { BaseComponent } from './BaseComponent';
import { TFObject } from './TFObject';

class GroupBy extends BaseComponent {
    public readonly sortBy: TFObject | undefined;

    constructor(ddJson: { [opt: string]: any }) {
        super(ddJson);

        this.sortBy = this.initSortBy();
    }

    private initSortBy(): TFObject | undefined {
        return this.ddJson.sort ? new TFObject('sort', this.ddJson.sort, true) : undefined;
    }

    protected propertyNames(): string[] {
        return ['sort'];
    }

    public toTerraform(): string {
        return `group_by {${super.toTerraform()}${this.sortByToTerraform()}}`;
    }

    private sortByToTerraform(): string {
        if (this.sortBy) {
            return ' ' + this.sortBy.toTerraform();
        }
        return '';
    }
}

export class Compute extends TFObject {
    constructor(ddJson: { [opt: string]: string | number }) {
        super('compute', ddJson, true);
    }

    protected propertyNames(): string[] {
        return [];
    }

    optionsToTerraform(): string {
        return super.optionsToTerraform();
    }
}

export class MultiCompute extends BaseComponent {
    public readonly computes: Compute[];
    constructor(computes: [{ [opt: string]: string | number }]) {
        super({});

        this.computes = computes.map(compute => new Compute(compute));
    }

    protected propertyNames(): string[] {
        return [];
    }

    toTerraform(): string {
        return `multi_compute = [${this.computesToTerraform()}]`;
    }

    private computesToTerraform(): string {
        return this.computes.map(compute => `{${compute.optionsToTerraform()}}`).join(', ');
    }
}

export class LogQuery {
    public readonly index: string;
    public readonly compute: Compute | MultiCompute;

    public readonly search: TFObject | undefined;
    public readonly groupBy: GroupBy[];

    protected readonly ddJson: { [key: string]: any };

    constructor(ddJson: { [opt: string]: any }) {
        this.ddJson = ddJson;

        this.index = ddJson.index;
        this.compute = this.initCompute();

        this.search = this.initSearch();
        this.groupBy = this.initGroupBy();
    }

    private initCompute(): Compute | MultiCompute {
        if (this.ddJson.multi_compute) {
            return new MultiCompute(this.ddJson.multi_compute);
        }
        return new Compute(this.ddJson.compute);
    }

    private initSearch(): TFObject | undefined {
        if (this.ddJson.search) {
            return new TFObject('search', this.ddJson.search, true);
        }
        return undefined;
    }

    private initGroupBy(): GroupBy[] {
        if (this.ddJson.group_by) {
            return this.ddJson.group_by.map((group: any) => {
                return new GroupBy(group);
            });
        }
        return [];
    }

    public toTerraform(): string {
        return (
            `log_query {index = "${this.index}" ${this.compute.toTerraform()}` +
            `${this.searchToTerraform()}${this.groupByToTerraform()}}`
        );
    }

    private searchToTerraform(): string {
        if (this.search) {
            return ' ' + this.search.toTerraform();
        }
        return '';
    }

    private groupByToTerraform(): string {
        if (this.groupBy.length > 0) {
            return (
                ' ' +
                this.groupBy
                    .map((group: GroupBy) => {
                        return group.toTerraform();
                    })
                    .join(' ')
            );
        }
        return '';
    }
}
