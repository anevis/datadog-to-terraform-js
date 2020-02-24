import React from 'react';
import rightArrow from '../resources/static/images/right-arrow.svg';

import './Header.scss';

export class Header extends React.PureComponent {
    public render = (): object => {
        return (
            <div className="header">
                <h1>
                    Datadog JSON <img alt="to" className="right-arrow" src={rightArrow} /> Terraform
                </h1>
            </div>
        );
    };
}
