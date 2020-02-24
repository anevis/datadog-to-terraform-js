export class TFPrettier {
    private readonly indent: number;

    private prettySlr = '';
    private prevTfChar = '';
    private curTfChar = '';
    private inString = false;
    private bracketLevel = 1;

    constructor(indent?: number) {
        this.indent = indent || 0;
    }

    public pretty(tfStr: string): string {
        for (let tfPos = 0; tfPos < tfStr.length; tfPos++) {
            this.prevTfChar = this.curTfChar;
            this.curTfChar = tfStr[tfPos];
            if (this.curTfChar === '"' && this.prevTfChar !== '\\') {
                this.inString = !this.inString;
            }
            this.prettySlr += this.formatBrackets();
        }
        return this.prettySlr;
    }

    private formatBrackets(): string {
        if (!this.inString) {
            if (this.curTfChar === '{') {
                const formattedStr = `${this.curTfChar}\n${this.getIndent(this.bracketLevel)}`;
                this.bracketLevel++;
                return formattedStr;
            } else if (this.curTfChar === '}') {
                this.bracketLevel--;
                let formattedStr = `${this.curTfChar}\n`;
                if (this.bracketLevel > 1) {
                    formattedStr = `${this.getIndent(this.bracketLevel - 1)}${formattedStr}`;
                }
                if (this.prevTfChar !== '}') {
                    formattedStr = `\n${formattedStr}`;
                }
                return formattedStr;
            }
        }
        return this.curTfChar;
    }

    private getIndent(level: number): string {
        if (this.indent > 0) {
            return ' ' + Array(this.indent * level).join(' ');
        }
        return '';
    }
}
