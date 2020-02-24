import { Comparator, ConditionalFormat } from './ConditionalFormat';

describe('Import conditional formats JSON.', () => {
    it('Check the conditional formats properties can be imported from the JSON', () => {
        const ddJson = {
            comparator: '<',
            value: 0.5,
            palette: 'white_on_green'
        };
        const cFormat = new ConditionalFormat(ddJson);

        expect(cFormat.comparator).toBe(Comparator.LESS_THAN);
        expect(cFormat.value).toBe(0.5);
        expect(cFormat.palette).toBe('white_on_green');
    });
});

it('Construct conditional formats terraform.', () => {
    const ddJson = {
        comparator: '<',
        value: 0.5,
        palette: 'white_on_green'
    };
    const cFormat = new ConditionalFormat(ddJson);

    const terraformStr = cFormat.toTerraform();

    expect(terraformStr).toBe('conditional_formats {comparator = "<" value = "0.5" palette = "white_on_green"}');
});
