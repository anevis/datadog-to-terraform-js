import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ddLogo from '../resources/static/images/datadog-logo.jpg';
import tfLogo from '../resources/static/images/terraform.svg';
import { Dashboard } from '../converter/dashboard/Dashboard';
import { TFPrettier } from '../converter/formatter';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            font: '400 1.1rem Roboto, sans-serif',
            textAlign: 'center'
        },
        fieldTitle: {
            textAlign: 'left',
            marginLeft: '5%'
        },
        ddInput: {
            paddingBottom: '1.5rem'
        },
        ddInputLabel: {
            fontWeight: 'bold'
        },
        ddInputImage: {
            width: '1.5rem',
            paddingLeft: '0.5rem'
        },
        textarea: {
            width: '90%',
            borderLeft: 'none',
            borderRight: 'none',
            color: 'black'
        },
        error: {
            maxWidth: '300px',
            margin: 'auto'
        },
        output: {
            width: '90%',
            height: '20rem',
            backgroundColor: '#dddddd',
            padding: '15px 10px 10px',
            whiteSpace: 'pre-wrap',
            overflow: 'scroll',
            margin: 'auto',
            textAlign: 'left'
        },
        copy: {
            display: 'block',
            fontWeight: 'bold',
            textAlign: 'left',
            marginTop: '0.2rem',
            marginLeft: '5%'
        },
        prettyPrintContainer: {
            textAlign: 'left',
            marginLeft: '5%'
        },
        prettyPrintLabel: {
            fontSize: '0.8rem',
            fontWeight: 'bold'
        }
    })
);

const Converter: React.FC<{}> = () => {
    const [jsonStr, setJsonStr] = useState<string>('');
    const [prettyPrint, setPrettyPrint] = useState<boolean>(true);
    const [terraformStr, setTerraformStr] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const classes = useStyles();

    const onJSONChange = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        const jsonFldStr = (e.target as HTMLInputElement).value;
        setJsonStr(jsonFldStr);
    };

    React.useEffect(() => {
        setError(undefined);
        if (jsonStr) {
            try {
                const dashboard = new Dashboard(jsonStr);
                const tfStr = dashboard.toTerraform();
                const formatter = new TFPrettier(2);

                setTerraformStr(prettyPrint ? formatter.pretty(tfStr) : tfStr);
            } catch (err) {
                setError(err.message);
            }
        }
    }, [jsonStr, prettyPrint]);

    return (
        <div id="converter" className={classes.root}>
            <div className={classes.ddInput}>
                <div className={classes.fieldTitle}>
                    <label htmlFor="dd-json" className={classes.ddInputLabel}>
                        Datadog JSON
                    </label>
                    <img id="dd-logo" src={ddLogo} alt="Datadog" className={classes.ddInputImage} />
                </div>
                <textarea id="dd-json" className={classes.textarea} rows={15} onChange={onJSONChange} value={jsonStr} />
                {error && (
                    <MuiAlert elevation={6} variant="filled" severity="error" className={classes.error}>
                        {error}
                    </MuiAlert>
                )}
            </div>
            <div className={classes.ddInput}>
                <div className={classes.fieldTitle}>
                    <label htmlFor="dd-terraform" className={classes.ddInputLabel}>
                        Terraform
                    </label>
                    <img id="tf-logo" src={tfLogo} alt="Terraform" className={classes.ddInputImage} />
                </div>
                <div className={classes.prettyPrintContainer}>
                    <Switch
                        id="dd-terraform-pretty-print"
                        size="small"
                        color="primary"
                        checked={prettyPrint}
                        onChange={(): void => setPrettyPrint(!prettyPrint)}
                    />
                    <label htmlFor="dd-terraform-pretty-print" className={classes.prettyPrintLabel}>
                        Pretty print
                    </label>
                </div>
                <pre id="dd-terraform" className={classes.output}>
                    {terraformStr}
                </pre>
                <CopyToClipboard text={terraformStr || ''}>
                    <Button
                        id="btn-copy-terraform"
                        title="Copy"
                        variant="outlined"
                        onClick={(): void => setCopySuccess(true)}
                        className={classes.copy}
                    >
                        Copy
                    </Button>
                </CopyToClipboard>
                <Snackbar open={copySuccess} autoHideDuration={6000} onClose={(): void => setCopySuccess(false)}>
                    <MuiAlert elevation={6} variant="filled" severity="success">
                        Terraform successfully copied!
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
};

export default Converter;
