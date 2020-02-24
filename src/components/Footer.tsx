import React from 'react';
import ddLogo from '../resources/static/images/datadog-logo.jpg';
import tfLogo from '../resources/static/images/terraform.svg';

import './Footer.scss';

export class Footer extends React.PureComponent {
    public render = (): object => {
        return (
            <div className="footer">
                <div className="trademarks">
                    <span className="disclaimer">
                        Disclaimer: Please note this project is NOT in anyway sponsored or endorsed by Datadog. Inc. or
                        HashiCorp. Inc.
                    </span>
                    <span className="datadog">
                        <a href="https://www.datadoghq.com/">
                            <img id="dd-logo" src={ddLogo} alt="Datadog" />
                            Datadog is a trademark of Datadog, Inc.
                        </a>
                    </span>
                    <span className="terraform">
                        <a href="https://www.terraform.io/">
                            <img id="tf-logo" src={tfLogo} alt="Terraform" />
                            Terraform is a trademark of HashiCorp, Inc.
                        </a>
                    </span>
                </div>
                <div className="copyright">
                    Copyright © 2020. All Rights Reserved.{' '}
                    <a href="https://github.com/anevis/datadog-to-terraform-js/blob/master/LICENSE">Licence</a>
                </div>
            </div>
        );
    };
}
