import React from 'react';
import Converter from './Converter';
import Header from './Header';
import Footer from './Footer';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            color: '#333333',
            font: '400 1rem Roboto, sans-serif'
        }
    })
);

const App: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Header />
            <Converter />
            <Footer />
        </div>
    );
};

export default App;
