import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

import { rootReducer } from './reducer';
import { actionHandler, registerHandler } from './middlewares/actionHandler';
import { ApplicationActionType } from './store/application/actions';
import { AreaPageActionType } from './store/areaPage/actions';
import { callBackend } from './actionHandlers/callBackend';
import { sessionHandler } from './actionHandlers/sessionHandler';
import { sendQuery } from './actionHandlers/sendQuery';
import { AppContainer } from './components/App/AppContainer';
import * as serviceWorker from './serviceWorker';

import './index.css';

const store = createStore(rootReducer, applyMiddleware(actionHandler));

registerHandler(callBackend, ApplicationActionType.CALL_BACKEND);
registerHandler(sessionHandler, ApplicationActionType.SET_SESSION, ApplicationActionType.RESET_SESSION);
registerHandler(sendQuery, AreaPageActionType.SEND_QUERY);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,

    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
