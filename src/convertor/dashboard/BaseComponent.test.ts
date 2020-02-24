import { BaseComponent } from './BaseComponent';

class DummyBaseComponent extends BaseComponent {
    public constructor(ddJson: { [key: string]: string | number | boolean }) {
        super(ddJson);
    }

    protected propertyNames(): string[] {
        return ['type'];
    }
}

const DATADOG_JSON = {
    type: 'free_text',
    text: 'RDS',
    color: '#774aa4',
    font_size: '56',
    text_align: 'left',
    dummy_bool: true
};

describe('Import Options from JSON.', () => {
    it('Check the options can be imported from the JSON', () => {
        const component = new DummyBaseComponent(DATADOG_JSON);

        expect(component.options).toEqual({
            text: 'RDS',
            color: '#774aa4',
            font_size: '56',
            text_align: 'left',
            dummy_bool: true
        });
    });
});

describe('Construct Basic Component terraform.', () => {
    it('Construct Basic Component terraform.', () => {
        const component = new DummyBaseComponent(DATADOG_JSON);

        const terraformStr = component.toTerraform();

        expect(terraformStr).toBe(
            'text = "RDS" color = "#774aa4" font_size = "56" text_align = "left" dummy_bool = true'
        );
    });
});
