import React from 'react';

import { Layout, Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';

import { SignOutButtonContainer } from '../SignOutButton/SignOutButtonContainer';
import { GuardForAuthorized } from '../Guard/GuardForAuthorized';

import './PageContainer.css';

export class PageContainer extends React.Component<React.PropsWithChildren<{}>> {

    render() {
        return (
            <Layout className="page">
                <Panel>
                    <AppBar>
                        <div className="page-title">
                            <div className="page-title-left">
                                Наумова Надежда Александровна<br />
                                Группа: <strong>P3201</strong>
                            </div>

                            <div className="page-title-right">
                                Вариант: <strong>20155</strong>

                                <GuardForAuthorized>
                                    <div className="sign-out-button-container">
                                        <SignOutButtonContainer />
                                    </div>
                                </GuardForAuthorized>
                            </div>
                        </div>
                    </AppBar>

                    <div className="page-content">
                        {this.props.children}
                    </div>
                </Panel>
            </Layout>
        );
    }
}
