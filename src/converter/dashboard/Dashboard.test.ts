import { Dashboard, LayoutType } from './Dashboard';

describe('Import dashboard JSON.', () => {
    it('Check the dashboard properties can be imported from the JSON string', () => {
        const jsonStr =
            '{"title": "My Screenboard",' +
            ' "description": "Test Dashboard",' +
            ' "layout_type": "free",' +
            ' "is_read_only": false,' +
            ' "notify_list": []' +
            '}';
        const dashboard = new Dashboard(jsonStr);

        expect(dashboard.layoutType).toBe(LayoutType.FREE);
        expect(dashboard.notifyList).toEqual([]);
        expect(dashboard.templateVariables).toEqual([]);
    });

    it('Check the widgets are empty when imported from the JSON string', () => {
        const jsonStr =
            '{"title": "My Screenboard",' + ' "description": "Test Dashboard",' + ' "layout_type": "free"' + '}';
        const dashboard = new Dashboard(jsonStr);

        expect(dashboard.widgets).toEqual([]);
    });

    it('Check two widgets are imported from the JSON string', () => {
        const jsonStr =
            '{"title": "My Screenboard",' +
            ' "description": "Test Dashboard",' +
            ' "layout_type": "free",' +
            ' "widgets": [{"definition": {"type": "timeseries", "title": "RDS CPU Utilisation"}},' +
            ' {"definition": {"type": "timeseries", "title": "RDS CPU Utilisation 2"}}]' +
            '}';
        const dashboard = new Dashboard(jsonStr);

        expect(dashboard.widgets.length).toBe(2);
    });

    it('Check the dashboard template_variables can be imported from the JSON string', () => {
        const jsonStr = '{"title": "My Screenboard",' + ' "template_variables": [{"name": "Site"}]' + '}';
        const dashboard = new Dashboard(jsonStr);

        expect(dashboard.templateVariables).toBeDefined();
    });
});

describe('Construct Dashboard terraform.', () => {
    it('Construct Dashboard terraform with options and title.', () => {
        const ddJson =
            '{"title": "My Screenboard",' + ' "description": "Test Dashboard",' + ' "layout_type": "free"' + '}';
        const dashboard = new Dashboard(ddJson);

        const terraformStr = dashboard.toTerraform();

        expect(terraformStr).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My Screenboard"' +
                ' description = "Test Dashboard" layout_type = "free"}'
        );
    });

    it('Construct Request terraform with widgets.', () => {
        const ddJson =
            '{"title": "My Screenboard", "layout_type": "free",' +
            ' "widgets": [{"definition": {"type": "timeseries", "title": "RDS CPU Utilisation"}},' +
            ' {"definition": {"type": "timeseries", "title": "RDS CPU Utilisation 2"}}]' +
            '}';
        const dashboard = new Dashboard(ddJson);

        const terraformStr = dashboard.toTerraform();

        expect(terraformStr).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My Screenboard" layout_type = "free"' +
                ' widget {timeseries_definition {title = "RDS CPU Utilisation"}}' +
                ' widget {timeseries_definition {title = "RDS CPU Utilisation 2"}}}'
        );
    });

    it('Construct Request terraform with notify_list.', () => {
        const ddJson = '{"title": "My Screenboard",' + ' "layout_type": "free",' + ' "notify_list": ["@my-id"]}';
        const dashboard = new Dashboard(ddJson);

        const terraformStr = dashboard.toTerraform();

        expect(terraformStr).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My Screenboard" layout_type = "free"' +
                ' notify_list = ["@my-id"]}'
        );
    });

    it('Construct Request terraform with template_variables.', () => {
        const jsonStr =
            '{"title": "My Screenboard",' +
            ' "layout_type": "free",' +
            ' "template_variables": [{"name": "Site"}]' +
            '}';
        const dashboard = new Dashboard(jsonStr);

        const terraformStr = dashboard.toTerraform();

        expect(terraformStr).toBe(
            'resource "datadog_dashboard" "dashboard" {title = "My Screenboard" layout_type = "free"' +
                ' template_variable {name = "Site"}}'
        );
    });
});
