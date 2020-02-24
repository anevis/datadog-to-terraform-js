import React from 'react';
import { Converter } from './Converter';
import { Header } from './Header';

import './App.scss';

export class App extends React.PureComponent {
    public render = (): object => {
        return (
            <div className="app">
                <Header />
                <Converter />
            </div>
        );
    };
}
