import { MiddlewareAPI } from 'redux';

import { callBackend, callBackendWithNotify } from '../store/application/actions';
import { addQuery, SendQueryAction } from '../store/areaPage/actions';
import { RootState } from '../reducer';

export function sendQuery(action: SendQueryAction, store: MiddlewareAPI) {
    const state = store.getState() as RootState;

    const x = action.x ?? state.areaPage.form.x;
    const y = action.y ?? state.areaPage.form.y;
    const r = action.r ?? state.areaPage.form.r;

    if (x !== undefined && y !== undefined && r !== undefined) {
        store.dispatch(callBackendWithNotify(callBackend(
            'area/check',
            async fetch => {
                const response = await fetch;

                if (!response.ok) {
                    return;
                }

                const result = await response.json();
                store.dispatch(addQuery({ x, y, r, result }));
            },
            state.application.session,
            'POST',
            { x, y, r }
        )));
    }
}
