import { Dashboard } from '../dashboard/Dashboard';
import { TFDashboardFormatter } from './TDDashboardFormatter';

const each = require('jest-each').default;

describe('Format terraform', () => {
    each([
        [new Dashboard('{}'), 'resource "datadog_dashboard" "dashboard" {layout_type = "undefined"}'], // Dashboard no options
        [
            new Dashboard('{"layout_type": "free", "title": "My Screenboard"}'),
            'resource "datadog_dashboard" "dashboard" {layout_type = "free" title = "My Screenboard"}'
        ], // Dashboard with options
        [
            new Dashboard('{"layout_type": "free", "title": "My Screenboard"}'),
            'resource "datadog_dashboard" "dashboard" {\n  layout_type = "free"\n  title = "My Screenboard"\n}',
            true,
            2
        ], // Dashboard with options with indent
        [
            new Dashboard('{"layout_type": "free", "notify_list": ["@my-id"]}'),
            'resource "datadog_dashboard" "dashboard" {layout_type = "free" notify_list = ["@my-id"]}'
        ], // Dashboard with options
        [
            new Dashboard('{"layout_type": "free", "notify_list": ["@my-id"]}'),
            'resource "datadog_dashboard" "dashboard" {\n  layout_type = "free"\n  notify_list = ["@my-id"]\n}',
            true,
            2
        ] // Dashboard with options with indent
    ]).it(
        'Check that %s is successfully converted..',
        (tfObject: Dashboard, expected: string, prettyPrint = false, indent = 0) => {
            const tfPrettier = new TFDashboardFormatter(tfObject, prettyPrint, indent);
            expect(tfPrettier.format()).toEqual(expected);
        }
    );
});
