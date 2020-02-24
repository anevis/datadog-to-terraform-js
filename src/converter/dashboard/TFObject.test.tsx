import { TFObject } from './TFObject';

describe('Construct TFObject terraform.', () => {
    it('Construct TFObject terraform for name yaxis.', () => {
        const ddJson = {
            scale: 'linear',
            min: 1
        };
        const tfObject = new TFObject('yaxis', ddJson);

        const terraformStr = tfObject.toTerraform();

        expect(terraformStr).toBe('yaxis {scale = "linear" min = 1}');
    });

    it('Construct TFObject terraform with assignment character (=).', () => {
        const ddJson = {
            scale: 'linear',
            min: 1
        };
        const tfObject = new TFObject('yaxis', ddJson, true);

        const terraformStr = tfObject.toTerraform();

        expect(terraformStr).toBe('yaxis = {scale = "linear" min = 1}');
    });
});
