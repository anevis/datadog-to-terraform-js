import React from 'react';
import rightArrow from '../resources/static/images/right-arrow.svg';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginLeft: '5%'
        },
        rightArrow: {
            width: '1.5rem'
        }
    })
);

const Header: React.FC<{}> = () => {
    const classes = useStyles();
    return (
        <header>
            <div className={classes.root}>
                <h1>
                    Datadog JSON <img alt="to" className={classes.rightArrow} src={rightArrow} /> Terraform
                </h1>
            </div>
        </header>
    );
};

export default Header;
