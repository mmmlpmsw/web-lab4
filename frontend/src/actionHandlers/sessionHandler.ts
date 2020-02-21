import { MiddlewareAPI } from 'redux';

import { ApplicationActionType, callBackend, callBackendWithoutLock,
    ResetSessionAction, SetSessionAction } from '../store/application/actions';
import { clean } from '../store/areaPage/actions';
import { RootState } from '../reducer';

export function sessionHandler(action: SetSessionAction | ResetSessionAction, store: MiddlewareAPI) {
    switch (action.type) {
        case ApplicationActionType.SET_SESSION:
            localStorage.setItem('session', JSON.stringify((action as SetSessionAction).session));
            break;

        case ApplicationActionType.RESET_SESSION:
            localStorage.removeItem('session');

            store.dispatch(clean());

            const { session } = (store.getState() as RootState).application;

            if (session) {
                store.dispatch(callBackendWithoutLock(callBackend('session/destroy',
                    Promise.resolve, session, 'DELETE', { token: session.token })));
            }
            break;
    }
}
