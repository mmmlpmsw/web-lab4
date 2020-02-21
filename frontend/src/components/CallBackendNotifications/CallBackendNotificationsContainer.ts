import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { CallBackendNotifications, CallBackendNotificationsProps } from './CallBackendNotifications';
import { hideBackendNotification, resetSession } from '../../store/application/actions';
import { RootState } from '../../reducer';

type StateProps = Pick<CallBackendNotificationsProps, 'shownCallBackendNotification'>;

function mapStateToProps(state: RootState): StateProps {
    return { shownCallBackendNotification: state.application.shownCallBackendNotification };
}

type DispatchProps = Pick<CallBackendNotificationsProps, 'onNotificationHide' | 'onSignOut'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onNotificationHide() { dispatch(hideBackendNotification()); },
        onSignOut() { dispatch(resetSession()); }
    };
}

export const CallBackendNotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(CallBackendNotifications);
