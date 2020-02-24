import React from 'react';
import { Converter } from './Converter';
import { Header } from './Header';
import { Footer } from './Footer';

import './App.scss';

export class App extends React.PureComponent {
    public render = (): object => {
        return (
            <div className="app">
                <Header />
                <Converter />
                <Footer />
            </div>
        );
    };
}
