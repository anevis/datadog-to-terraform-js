import React from 'react';
import ddLogo from '../resources/static/images/datadog-logo.jpg';
import tfLogo from '../resources/static/images/terraform.svg';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            borderTop: '0.5px solid gray',
            paddingTop: '1rem',
            paddingBottom: '1rem'
        },
        disclaimer: {
            display: 'block',
            paddingLeft: '0.5rem',
            paddingBottom: '0.5rem'
        },
        trademarks: {
            fontSize: '0.7rem',
            display: 'inline-block'
        },
        trademark: {
            borderLeft: '1px solid lightgray',
            paddingRight: '0.5rem',
            paddingTop: '0.5rem'
        },
        image: {
            width: '1rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.2rem'
        },
        copyright: {
            fontSize: '0.7rem',
            float: 'right'
        }
    })
);

const Footer: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography component="span" className={classes.trademarks}>
                <span className={classes.disclaimer}>
                    Disclaimer: Please note this project is NOT in anyway sponsored or endorsed by Datadog. Inc. or
                    HashiCorp. Inc.
                </span>
                <span className={classes.trademark}>
                    <Link component="a" underline="none" href="https://www.datadoghq.com/">
                        <img id="dd-logo" src={ddLogo} alt="Datadog" className={classes.image} />
                        Datadog is a trademark of Datadog, Inc.
                    </Link>
                </span>
                <span className={classes.trademark}>
                    <Link component="a" underline="none" href="https://www.terraform.io/">
                        <img id="tf-logo" src={tfLogo} alt="Terraform" className={classes.image} />
                        Terraform is a trademark of HashiCorp, Inc.
                    </Link>
                </span>
            </Typography>
            <Typography component="span" className={classes.copyright}>
                Copyright © 2020. All Rights Reserved.{' '}
                <Link
                    component="a"
                    underline="none"
                    href="https://github.com/anevis/datadog-to-terraform-js/blob/main/LICENSE"
                >
                    Licence
                </Link>
            </Typography>
        </div>
    );
};

export default Footer;
