import { BaseComponent } from './BaseComponent';

class DummyBaseComponent extends BaseComponent {
    public constructor(ddJson: { [key: string]: string | number | boolean | string[] }) {
        super(ddJson);
    }

    protected propertyNames(): string[] {
        return ['type'];
    }
}

describe('Import Options from JSON.', () => {
    it('Check the options can be imported from the JSON', () => {
        const component = new DummyBaseComponent({
            type: 'free_text',
            text: 'RDS',
            color: '#774aa4',
            font_size: '56',
            text_align: 'left',
            dummy_bool: true
        });

        expect(component.options).toEqual({
            text: 'RDS',
            color: '#774aa4',
            font_size: '56',
            text_align: 'left',
            dummy_bool: true
        });
    });

    it('Check the array options can be imported from the JSON', () => {
        const component = new DummyBaseComponent({
            group: ['availability-zone', 'application']
        });

        expect(component.options).toEqual({
            group: ['availability-zone', 'application']
        });
    });
});

describe('Construct Basic Component terraform.', () => {
    it('Construct Basic Component terraform.', () => {
        const component = new DummyBaseComponent({
            type: 'free_text',
            text: 'RDS',
            color: '#774aa4',
            font_size: '56',
            number: 56,
            text_align: 'left',
            dummy_bool: true,
            group: ['availability-zone', 'application']
        });

        const terraformStr = component.toTerraform();

        expect(terraformStr).toBe(
            'text = "RDS" color = "#774aa4" font_size = "56" number = 56 text_align = "left" ' +
                'dummy_bool = true group = ["availability-zone", "application"]'
        );
    });

    it('Test BaseComponent formatString with escaped double quotes.', () => {
        const terraformStr = BaseComponent.formatString('@response_time by @path over \\"service:xplan @path:*\\"');

        expect(terraformStr).toBe('@response_time by @path over \\\\"service:xplan @path:*\\\\"');
    });
});
