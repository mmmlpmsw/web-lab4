    import { Dispatch, MiddlewareAPI } from 'redux';

import { CallBackendAction, CallBackendActionNotificationType, HttpMethod,
    lock, showBackendNotification, unlock } from '../store/application/actions';
import { Session } from '../models/session';

// todo
const backendHost = '//localhost:8080';
// const backendHost = '';

export function callBackend(action: CallBackendAction, store: MiddlewareAPI) {
    (async () => {
        try {
            if (action.lock) {
                store.dispatch(lock());
            }

            let fetch: Promise<Response>;
            if (action.session === undefined) {
                fetch = backendApi(action.method, action.httpMethod, action.data, action.init);
            } else {
                fetch = authorizedBackendApi(action.method, action.session, action.httpMethod, action.data, action.init);
            }

            if (action.notify) {
                await action.onFetch(backendApiUserNotifyWrapper(fetch, action.excludedNotifications, store.dispatch));
            } else {
                await action.onFetch(fetch);
            }
        } catch (e) {
            console.log(e);
        } finally {
            if (action.lock) {
                store.dispatch(unlock());
            }
        }
    })();
}

function backendApi(
    method: string,
    httpMethod: HttpMethod,
    data: { [key: string]: any },
    init: { headers?: Headers | { [key: string]: any }, [key: string]: any }
): Promise<Response> {
    const dataArray: string[] = [];

    for (const key in data) {
        dataArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }

    return fetch(`${backendHost}/api/v1/${method}`, {
        ...init,

        method: httpMethod,
        body: ['GET', 'HEAD'].includes(httpMethod.toUpperCase())
            ? undefined
            : dataArray.join('&'),

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',

            ...init.headers
        }
    });
}

function authorizedBackendApi(
    method: string,
    session: Session,
    httpMethod: HttpMethod,
    data: { [key: string]: any },
    init: { headers?: Headers | { [key: string]: any }, [key: string]: any }
) {
    return backendApi(method, httpMethod, data, {
        ...init,

        headers: {
            'X-USER-ID': session.userId,
            'X-TOKEN': session.token,

            ...init.headers
        }
    });
}

async function backendApiUserNotifyWrapper(
    fetch: Promise<Response>,
    exclude: CallBackendActionNotificationType[],
    dispatch: Dispatch
): Promise<Response> {
    function dispatchNotification(type: CallBackendActionNotificationType) {
        if (!exclude.includes(type)) {
            dispatch(showBackendNotification(type));
        }
    }

    try {
        const response = await fetch;

        if (!response.ok) {
            switch (response.status) {
                case 400:
                    dispatchNotification(CallBackendActionNotificationType.INVALID_VALUE);
                    break;

                case 401:
                    dispatchNotification(CallBackendActionNotificationType.SESSION_EXPIRED);
                    break;
            }
        }

        return fetch;
    } catch (e) {
        dispatchNotification(CallBackendActionNotificationType.CANNOT_CONNECT);

        throw e;
    }
}
