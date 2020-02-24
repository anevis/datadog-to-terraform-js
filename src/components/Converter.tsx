import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import './Converter.scss';
import ddLogo from '../resources/static/images/datadog-logo.jpg';
import tfLogo from '../resources/static/images/terraform.svg';
import { Dashboard } from '../converter/dashboard/Dashboard';
import { TFPrettier } from '../converter/formatter';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

export interface ConverterProps {
    jsonStr?: string;
}

export interface ConverterState {
    jsonStr: string;
    terraformStr?: string;
    error?: string;
    prettyPrint: boolean;
}

export class Converter extends React.PureComponent<ConverterProps, ConverterState> {
    constructor(props: ConverterProps) {
        super(props);
        this.state = {
            jsonStr: props.jsonStr || '',
            prettyPrint: true
        };
    }

    public render = (): object => {
        return (
            <div id="converter" className="converter">
                <div className="dd-input dd-input-json">
                    <div className="field-title">
                        <label htmlFor="dd-json">Datadog JSON</label>
                        <img id="dd-logo" src={ddLogo} alt="Datadog" />
                    </div>
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
                    <div className="field-title">
                        <label htmlFor="dd-terraform">Terraform</label>
                        <img id="tf-logo" src={tfLogo} alt="Terraform" />
                    </div>
                    <div className="dd-terraform-pretty-print-div">
                        <Switch
                            id="dd-terraform-pretty-print"
                            size="small"
                            color="primary"
                            checked={this.state.prettyPrint}
                            onChange={this.onPrettyPrint()}
                        />
                        <label htmlFor="dd-terraform-pretty-print">Pretty print</label>
                    </div>
                    <pre id="dd-terraform" className="dd-terraform">
                        {this.state.terraformStr}
                    </pre>
                    <CopyToClipboard text={this.state.terraformStr || ''}>
                        <Button id="btn-copy-terraform" title="Copy" variant="outlined" onClick={Converter.onCopy}>
                            Copy
                        </Button>
                    </CopyToClipboard>
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                        pauseOnHover
                    />
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

    private onPrettyPrint() {
        return (): void => {
            this.setState({ prettyPrint: !this.state.prettyPrint }, () => {
                this.convert();
            });
        };
    }

    private static onCopy(): void {
        toast.success('Terraform successfully copied.', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }
}
