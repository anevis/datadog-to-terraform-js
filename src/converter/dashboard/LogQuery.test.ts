import { LogQuery } from './LogQuery';

describe('Import LogQuery from JSON.', () => {
    it('Check that LogQuery index can be imported from the JSON without an error.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max',
                facet: '@response_time'
            }
        };
        const logQuery = new LogQuery(ddJson);

        expect(logQuery.index).toBe('main');
    });

    it('Check that LogQuery compute can be imported from the JSON.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max',
                facet: '@response_time'
            }
        };

        const logQuery = new LogQuery(ddJson);

        expect(logQuery.compute.name).toEqual('compute_query');
        expect(logQuery.compute.computes.length).toBe(1);
        expect(logQuery.compute.computes[0].options).toEqual({
            aggregation: 'max',
            facet: '@response_time'
        });
    });

    it('Check that LogQuery multi_compute can be imported from the JSON.', () => {
        const ddJson = {
            index: 'main',
            multi_compute: [
                {
                    aggregation: 'max',
                    facet: '@response_time'
                },
                { aggregation: 'count' }
            ]
        };

        const logQuery = new LogQuery(ddJson);
        expect(logQuery.compute.name).toEqual('multi_compute');
        expect(logQuery.compute.computes.length).toBe(2);
    });

    it('Check that LogQuery search and group_by are empty when not in JSON.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max',
                facet: '@response_time'
            }
        };

        const logQuery = new LogQuery(ddJson);

        expect(logQuery.search).toBeUndefined();
        expect(logQuery.groupBy).toEqual([]);
    });

    it('Check that LogQuery search can be imported from the JSON.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max',
                facet: '@response_time'
            },
            search: {
                query: 'my search query'
            }
        };

        const logQuery = new LogQuery(ddJson);

        expect(logQuery.search).toBeDefined();
    });

    it('Check that LogQuery group by can be imported from the JSON.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max',
                facet: '@response_time'
            },
            group_by: [
                {
                    facet: '@path',
                    limit: 10
                }
            ]
        };

        const logQuery = new LogQuery(ddJson);

        expect(logQuery.groupBy).toBeDefined();
    });

    it('Check that LogQuery group bys sort can be imported from the JSON.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max'
            },
            group_by: [
                {
                    sort: {
                        aggregation: 'max',
                        order: 'desc',
                        facet: '@response_time'
                    }
                }
            ]
        };

        const logQuery = new LogQuery(ddJson);

        expect(logQuery.groupBy[0].sortBy).toBeDefined();
    });
});

describe('Construct LogQuery terraform.', () => {
    it('Construct LogQuery terraform for index and compute.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max'
            }
        };
        const logQuery = new LogQuery(ddJson);

        const terraformStr = logQuery.toTerraform();

        expect(terraformStr).toBe('log_query {index = "main" compute_query {aggregation = "max"}}');
    });

    it('Construct LogQuery terraform for search.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max'
            },
            search: {
                query: 'my search query'
            }
        };
        const logQuery = new LogQuery(ddJson);

        const terraformStr = logQuery.toTerraform();

        expect(terraformStr).toBe(
            'log_query {index = "main" compute_query {aggregation = "max"} search_query = "my search query"}'
        );
    });

    it('Construct LogQuery terraform for group_by option.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max'
            },
            group_by: [
                {
                    facet: '@path'
                }
            ]
        };
        const logQuery = new LogQuery(ddJson);

        const terraformStr = logQuery.toTerraform();

        expect(terraformStr).toBe(
            'log_query {index = "main" compute_query {aggregation = "max"} group_by {facet = "@path"}}'
        );
    });

    it('Construct LogQuery terraform for group_by option and sort.', () => {
        const ddJson = {
            index: 'main',
            compute: {
                aggregation: 'max'
            },
            group_by: [
                {
                    facet: '@path',
                    sort: {
                        aggregation: 'max'
                    }
                }
            ]
        };
        const logQuery = new LogQuery(ddJson);

        const terraformStr = logQuery.toTerraform();

        expect(terraformStr).toBe(
            'log_query {index = "main" compute_query {aggregation = "max"} group_by {facet = "@path" sort_query {aggregation = "max"}}}'
        );
    });

    it('Check that LogQuery terraform for multi_compute.', () => {
        const ddJson = {
            index: 'main',
            multi_compute: [
                {
                    aggregation: 'max',
                    facet: '@response_time'
                },
                { aggregation: 'count' }
            ]
        };

        const logQuery = new LogQuery(ddJson);

        const terraformStr = logQuery.toTerraform();

        expect(terraformStr).toBe(
            'log_query {index = "main" multi_compute {aggregation = "max" facet = "@response_time"} multi_compute {aggregation = "count"}}'
        );
    });
});
