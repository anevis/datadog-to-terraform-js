import { TFPrettier } from './formatter';

describe('Format terraform', () => {
    it('Start and end Curly Brackets {} in new line.', () => {
        const jsonStr = 'x {}';
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n\n}\n');
    });

    it('Start and end Square Brackets [] in new line.', () => {
        const jsonStr = 'x {[]}';
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n[]\n}\n');
    });

    it('Skip formatting Brackets if inside a string.', () => {
        const jsonStr = 'x {"{}"}';
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n"{}"\n}\n');
    });

    it('Skip double quote inside a string.', () => {
        const jsonStr = 'x {"{\\"}"}';
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n"{\\"}"\n}\n');
    });

    it('Do not add new line if previous code was a close bracket.', () => {
        const jsonStr = 'x {{[]}}';
        const tfPrettier = new TFPrettier();
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n{\n[]\n}\n}\n');
    });

    it('Indent after brackets.', () => {
        const jsonStr = 'x {testing1 = "My test"}';
        const tfPrettier = new TFPrettier(2);
        expect(tfPrettier.pretty(jsonStr)).toEqual('x {\n  testing1 = "My test"\n}\n');
    });

    it('Indent level 2 brackets.', () => {
        const jsonStr = 'x {testing1 = "My test" l2test = {l2Prop = "L2 Prop"}}';
        const tfPrettier = new TFPrettier(2);
        expect(tfPrettier.pretty(jsonStr)).toEqual(
            'x {\n  testing1 = "My test" l2test = {\n    l2Prop = "L2 Prop"\n  }\n}\n'
        );
    });

    it('Indent level 3 brackets.', () => {
        const jsonStr = 'x {testing1 = "My test" l2test = {l2Prop = {l3prop = "L3 Prop"}}}';
        const tfPrettier = new TFPrettier(2);
        expect(tfPrettier.pretty(jsonStr)).toEqual(
            'x {\n  testing1 = "My test" l2test = {\n    l2Prop = {\n      l3prop = "L3 Prop"\n    }\n  }\n}\n'
        );
    });
});
