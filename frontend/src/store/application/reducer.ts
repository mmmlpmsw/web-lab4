import { ApplicationAction, ApplicationActionType, CallBackendActionNotificationType } from './actions';
import { Session } from '../../models/session';

export interface ApplicationState {

    session?: Session;
    locked: boolean;
    shownCallBackendNotification?: CallBackendActionNotificationType;
}

const initialState: ApplicationState = {

    locked: false
};

export function application(state: ApplicationState = initialState, action: ApplicationAction): ApplicationState {
    switch (action.type) {
        case ApplicationActionType.SET_SESSION:
            return { ...state, session: action.session };

        case ApplicationActionType.RESET_SESSION:
            return { ...state, session: undefined };

        case ApplicationActionType.LOCK:
            return { ...state, locked: true };

        case ApplicationActionType.UNLOCK:
            return { ...state, locked: false };

        case ApplicationActionType.SHOW_BACKEND_NOTIFICATION_ACTION:
            return { ...state, shownCallBackendNotification: action.notificationType };

        case ApplicationActionType.HIDE_BACKEND_NOTIFICATION_ACTION:
            return { ...state, shownCallBackendNotification: undefined };
    }

    return state;
}
