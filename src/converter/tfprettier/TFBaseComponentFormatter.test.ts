import { TFBaseComponentFormatter } from './TFBaseComponentFormatter';
import { BaseComponent } from '../dashboard/BaseComponent';

const each = require('jest-each').default;

class TestBaseComponent extends BaseComponent {
    public constructor(ddJson: { [key: string]: string | number | boolean | string[] }) {
        super(ddJson);
    }

    protected propertyNames(): string[] {
        return [];
    }
}

describe('Format terraform', () => {
    each([
        [new TestBaseComponent({}), ''], // Single line no options
        [new TestBaseComponent({ testing1: 'My test' }), 'testing1 = "My test"'], // Single line one string option
        [new TestBaseComponent({ opt1: true }), 'opt1 = true'], // One boolean option
        [new TestBaseComponent({ opt1: 3 }), 'opt1 = 3'], // One number option
        [new TestBaseComponent({ opt1: 'test \\"in quote\\" out' }), 'opt1 = "test \\\\"in quote\\\\" out"'], // Escape double quote inside a string.
        [new TestBaseComponent({ opt1: ['one', 'two', 'three'] }), 'opt1 = ["one", "two", "three"]'], // One array option
        [new TestBaseComponent({ opt1: 'Opt 1', opt2: 'Opt 2' }), 'opt1 = "Opt 1" opt2 = "Opt 2"'], // Single line two string options
        [new TestBaseComponent({ opt1: 'Opt 1', opt2: 'Opt 2' }), 'opt1 = "Opt 1"\nopt2 = "Opt 2"', true], // Pretty print two string options
        [new TestBaseComponent({ opt1: 'Opt 1', opt2: 'Opt 2' }), '  opt1 = "Opt 1"\n  opt2 = "Opt 2"', true, 2], // Pretty print two string options with indent
        [new TestBaseComponent({ opt1: 'Opt 1', opt2: 'Opt 2' }), '    opt1 = "Opt 1"\n    opt2 = "Opt 2"', true, 2, 2] // Pretty print two string options with level 2 indent
    ]).it(
        'Check that %s is successfully converted..',
        (tfObject: BaseComponent, expected: string, prettyPrint = false, indent = 0, depth = 1) => {
            const tfPrettier = new TFBaseComponentFormatter<BaseComponent>(tfObject, depth, prettyPrint, indent);
            expect(tfPrettier.format()).toEqual(expected);
        }
    );
});
