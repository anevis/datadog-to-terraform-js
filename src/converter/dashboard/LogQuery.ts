import { BaseComponent } from './BaseComponent';
import { TFObject } from './TFObject';

class GroupBy extends BaseComponent {
    public readonly sortBy: TFObject | undefined;

    constructor(ddJson: { [opt: string]: any }) {
        super(ddJson);

        this.sortBy = this.initSortBy();
    }

    private initSortBy(): TFObject | undefined {
        return this.ddJson.sort ? new TFObject('sort_query', this.ddJson.sort, false) : undefined;
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

class Compute extends BaseComponent {
    public readonly computes: TFObject[];
    public readonly name: string;

    constructor(isMulti: boolean, computes: [{ [opt: string]: string | number }]) {
        super({});

        this.name = isMulti ? 'multi_compute' : 'compute_query';
        this.computes = computes.map(compute => new TFObject(this.name, compute, false));
    }

    protected propertyNames(): string[] {
        return [];
    }

    toTerraform(): string {
        return this.computes.map(compute => compute.toTerraform()).join(' ');
    }
}

export class LogQuery {
    public readonly index: string;
    public readonly compute: Compute;

    public readonly search: string | undefined;
    public readonly groupBy: GroupBy[];

    protected readonly ddJson: { [key: string]: any };

    constructor(ddJson: { [opt: string]: any }) {
        this.ddJson = ddJson;

        this.index = ddJson.index;
        this.compute = this.initCompute();

        this.search = this.initSearch();
        this.groupBy = this.initGroupBy();
    }

    private initCompute(): Compute {
        if (this.ddJson.multi_compute) {
            return new Compute(true, this.ddJson.multi_compute);
        }
        return new Compute(false, [this.ddJson.compute]);
    }

    private initSearch(): string | undefined {
        if (this.ddJson.search) {
            return this.ddJson.search.query;
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
            return ` search_query = "${BaseComponent.formatString(this.search)}"`;
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
