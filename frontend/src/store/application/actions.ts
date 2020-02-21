import { Action } from 'redux';

import { Session } from '../../models/session';

export enum ApplicationActionType {

    SET_SESSION = 'SET_SESSION',
    RESET_SESSION = 'RESET_SESSION',

    LOCK = 'LOCK',
    UNLOCK = 'UNLOCK',

    CALL_BACKEND = 'CALL_BACKEND',
    SHOW_BACKEND_NOTIFICATION_ACTION = 'SHOW_BACKEND_NOTIFICATION_ACTION',
    HIDE_BACKEND_NOTIFICATION_ACTION = 'HIDE_BACKEND_NOTIFICATION_ACTION'
}

export interface SetSessionAction extends Action<ApplicationActionType.SET_SESSION> {

    session: Session;
}

export interface ResetSessionAction extends Action<ApplicationActionType.RESET_SESSION> {}

export interface LockAction extends Action<ApplicationActionType.LOCK> {}
export interface UnlockAction extends Action<ApplicationActionType.UNLOCK> {}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'PATCH' | 'PURGE' | 'HEAD' | string;

export enum CallBackendActionNotificationType {

    INVALID_VALUE = 'INVALID_VALUE',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    CANNOT_CONNECT = 'CANNOT_CONNECT'
}

export interface CallBackendAction extends Action<ApplicationActionType.CALL_BACKEND> {

    method: string;
    session?: Session;

    httpMethod: HttpMethod;
    data: { [key: string]: any };
    init: { headers?: Headers | { [key: string]: any }, [key: string]: any };

    notify: boolean;
    excludedNotifications: CallBackendActionNotificationType[];

    lock: boolean;

    onFetch(fetch: Promise<Response>): Promise<void>;
}

export interface ShowBackendNotificationAction extends Action<ApplicationActionType.SHOW_BACKEND_NOTIFICATION_ACTION> {

    notificationType: CallBackendActionNotificationType;
}

export interface HideBackendNotificationAction extends Action<ApplicationActionType.HIDE_BACKEND_NOTIFICATION_ACTION> {}

export type ApplicationAction = SetSessionAction | ResetSessionAction | LockAction | UnlockAction | CallBackendAction |
    ShowBackendNotificationAction | HideBackendNotificationAction;

export function setSession(session: Session): SetSessionAction {
    return { type: ApplicationActionType.SET_SESSION, session };
}

export function resetSession(): ResetSessionAction {
    return { type: ApplicationActionType.RESET_SESSION };
}

export function lock(): LockAction {
    return { type: ApplicationActionType.LOCK };
}

export function unlock(): UnlockAction {
    return { type: ApplicationActionType.UNLOCK };
}

export function callBackend(
    method: string,
    onFetch: (fetch: Promise<Response>) => Promise<void> = async () => {},
    session?: Session,
    httpMethod: HttpMethod = 'GET',
    data: { [key: string]: any } = {},
    init: { headers?: Headers | { [key: string]: any }, [key: string]: any } = {}
): CallBackendAction {
    return {
        type: ApplicationActionType.CALL_BACKEND,

        method, session, httpMethod, data, init,

        notify: false,
        excludedNotifications: [],

        lock: true,

        onFetch
    };
}

export function callBackendWithNotify(
    action: CallBackendAction,
    excludedNotifications: CallBackendActionNotificationType[] = []
): CallBackendAction {
    return { ...action, notify: true, excludedNotifications };
}

export function callBackendWithoutLock(action: CallBackendAction): CallBackendAction {
    return { ...action, lock: false };
}

export function showBackendNotification(
    notificationType: CallBackendActionNotificationType
): ShowBackendNotificationAction {
    return { type: ApplicationActionType.SHOW_BACKEND_NOTIFICATION_ACTION, notificationType };
}

export function hideBackendNotification(): HideBackendNotificationAction {
    return { type: ApplicationActionType.HIDE_BACKEND_NOTIFICATION_ACTION };
}
