import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage/LoginPage';
import { AreaPageContainer } from './pages/AreaPage/AreaPageContainer';

export const routes = (
    <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/area" component={AreaPageContainer} />
    </Switch>
);
