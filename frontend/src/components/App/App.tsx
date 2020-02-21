import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { routes } from '../../routes';
import { CallBackendNotificationsContainer } from '../CallBackendNotifications/CallBackendNotificationsContainer';
import { PageContainer } from '../PageContainer/PageContainer';

import './App.css';

export interface AppProps {

    loadSession(): void;
}

export class App extends React.Component<AppProps> {

    componentDidMount(): void {
        this.props.loadSession();
    }

    render() {
        return (
            <PageContainer>
                <BrowserRouter>
                    {routes}
                </BrowserRouter>

                <CallBackendNotificationsContainer />
            </PageContainer>
        );
    }
}
