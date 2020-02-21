import React from 'react';
import { Dialog, DialogActionProps } from 'react-toolbox/lib/dialog';

import { CallBackendActionNotificationType } from '../../store/application/actions';

export interface CallBackendNotificationsProps {

    shownCallBackendNotification?: CallBackendActionNotificationType;

    onNotificationHide(): void;
    onSignOut(): void;
}

export class CallBackendNotifications extends React.Component<CallBackendNotificationsProps> {

    private okDialogAction: DialogActionProps = { label: 'Ок', onClick: this.props.onNotificationHide };
    private cancelDialogAction: DialogActionProps = { label: 'Отмена', onClick: this.props.onNotificationHide };
    private signOutDialogAction: DialogActionProps = { label: 'Выход', onClick: () => {
        this.props.onNotificationHide();
        this.props.onSignOut();
    } };

    render() {
        const { shownCallBackendNotification, onNotificationHide } = this.props;

        return (
            <>
                <Dialog title="Ошибка запроса" actions={[this.okDialogAction]}
                        onOverlayClick={onNotificationHide} onEscKeyDown={onNotificationHide}
                        active={shownCallBackendNotification === CallBackendActionNotificationType.INVALID_VALUE}>
                    <p>
                        В одном или нескольких переданных параметрах была ошибка.<br />
                        Пожалуйста, проверьте отправленные данные и повторите попытку.
                    </p>
                </Dialog>

                <Dialog title="Сессия истекла" actions={[this.cancelDialogAction, this.signOutDialogAction]}
                        onOverlayClick={onNotificationHide} onEscKeyDown={onNotificationHide}
                        active={shownCallBackendNotification === CallBackendActionNotificationType.SESSION_EXPIRED}>
                    <p>
                        Ваша сессия истекла. Для продолжения работы выйдите и зайдите снова.
                    </p>
                </Dialog>

                <Dialog title="Ошибка соединения" actions={[this.okDialogAction]}
                        onOverlayClick={onNotificationHide} onEscKeyDown={onNotificationHide}
                        active={shownCallBackendNotification === CallBackendActionNotificationType.CANNOT_CONNECT}>
                    <p>
                        Произошла ошибка при подключении к серверу. Пожалуйста, попробуйте позже.
                    </p>
                </Dialog>
            </>
        )
    }
}
