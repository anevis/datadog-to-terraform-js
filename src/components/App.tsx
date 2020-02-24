import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import './App.scss';
import { Dashboard } from '../convertor/dashboard/Dashboard';
import { TFPrettier } from '../convertor/formatter';

export interface AppProps {
    jsonStr?: string;
}

export interface AppState {
    jsonStr: string;
    terraformStr?: string;
    error?: string;
    prettyPrint: boolean;
}

export class App extends React.PureComponent<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            jsonStr: props.jsonStr || '',
            prettyPrint: true
        };
    }

    public render = (): object => {
        return (
            <div className="app">
                <div className="dd-input dd-input-json">
                    <label htmlFor="dd-json">Datadog JSON</label>
                    <textarea
                        id="dd-json"
                        className="dd-textarea dd-json"
                        rows={15}
                        onChange={this.onJSONChange}
                        value={this.state.jsonStr}
                    />
                    <span id="dd-json-error" className="dd-error dd-json-error">
                        {this.state.error}
                    </span>
                </div>
                <div className="dd-input dd-input-terraform">
                    <label htmlFor="dd-terraform">Datadog Terraform</label>
                    <div className="dd-terraform-pretty-print-div">
                        <label htmlFor="dd-terraform-pretty-print">Pretty print</label>
                        <input
                            type="checkbox"
                            id="dd-terraform-pretty-print"
                            checked={this.state.prettyPrint}
                            onChange={this.onPrettyPrint()}
                        />
                    </div>
                    <pre id="dd-terraform" className="dd-terraform">
                        {this.state.terraformStr}
                    </pre>
                    <CopyToClipboard text={this.state.terraformStr || ''}>
                        <button id="btn-copy-terraform" title="Copy">
                            Copy
                        </button>
                    </CopyToClipboard>
                </div>
            </div>
        );
    };

    private onJSONChange = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        const jsonFldStr = (e.target as HTMLInputElement).value;
        this.setState({ jsonStr: jsonFldStr }, () => {
            this.convert();
        });
    };

    private convert(): void {
        const ddJsonStr = this.state.jsonStr;
        try {
            const dashboard = new Dashboard(ddJsonStr);
            const tfStr = dashboard.toTerraform();
            const formatter = new TFPrettier(2);

            this.setState({ terraformStr: this.state.prettyPrint ? formatter.pretty(tfStr) : tfStr, error: '' });
        } catch (err) {
            this.setState({ error: err.message });
        }
    }

    private onPrettyPrint = () => {
        return (): void => {
            this.setState({ prettyPrint: !this.state.prettyPrint }, () => {
                this.convert();
            });
        };
    };
}
