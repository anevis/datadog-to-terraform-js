/* eslint @typescript-eslint/no-var-requires: "off" */
import { TFPrettier } from './formatter';

const each = require('jest-each').default;

describe('Format terraform', () => {
    each([
        ['x {}', 'x {\n\n}\n'], // Start and end Curly Brackets {} in new line.
        ['x {"{}"}', 'x {\n"{}"\n}\n'], // Skip formatting Brackets if inside a string.
        ['x {"{\\"}"}', 'x {\n"{\\"}"\n}\n'], // Skip double quote inside a string.
        ['x {{[]}}', 'x {\n{\n[]\n}\n}\n'] // Do not add new line if previous code was a close bracket.
    ]).it('Check that %s is successfully converted..', (jsonStr: string, expected: string) => {
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual(expected);
    });

    each([
        ['x {testing1 = "My test"}', 'x {\n  testing1 = "My test"\n}\n'], // Indent after brackets.
        [
            'x {testing1 = "My test" l2test = {l2Prop = "L2 Prop"}}',
            'x {\n  testing1 = "My test" l2test = {\n    l2Prop = "L2 Prop"\n  }\n}\n'
        ], // Indent level 2 brackets.
        [
            'x {testing1 = "My test" l2test = {l2Prop = {l3prop = "L3 Prop"}}}',
            'x {\n  testing1 = "My test" l2test = {\n    l2Prop = {\n      l3prop = "L3 Prop"\n    }\n  }\n}\n'
        ] // Indent level 3 brackets.
    ]).it('Check that %s has correct indentation.', (jsonStr: string, expected: string) => {
        const tfPrettier = new TFPrettier(2);
        expect(tfPrettier.pretty(jsonStr)).toEqual(expected);
    });
});
