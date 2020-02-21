import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { LoginForm, LoginFormProps } from './LoginForm';
import {
    callBackend,
    CallBackendActionNotificationType,
    callBackendWithNotify,
    setSession
} from '../../store/application/actions';
import { RootState } from '../../reducer';

type StateProps = Pick<LoginFormProps, 'locked'>;

function mapStateToProps(state: RootState): StateProps {
    return { locked: state.application.locked };
}

type DispatchProps = Pick<LoginFormProps, 'onSignIn' | 'onSignUp'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onSignIn(username: string, password: string, onError: (status: number) => void): void {
            dispatch(callBackendWithNotify(callBackend(
                'session/create',
                async fetch => {
                    const response = await fetch;

                    if (response.ok) {
                        dispatch(setSession(await response.json()));
                        return;
                    }

                    onError(response.status);
                },
                undefined,
                'POST',
                { username, password }
            ), [
                CallBackendActionNotificationType.INVALID_VALUE,
                CallBackendActionNotificationType.SESSION_EXPIRED
            ]));
        },

        onSignUp(username: string, password: string, onSuccess: () => void, onError: (status: number) => void): void {
            dispatch(callBackendWithNotify(callBackend(
                'user/create',
                async fetch => {
                    const response = await fetch;

                    if (response.ok) {
                        onSuccess();
                        return;
                    }

                    onError(response.status);
                },
                undefined,
                'POST',
                { username, password }
            ), [
                CallBackendActionNotificationType.INVALID_VALUE
            ]));
        }
    };
}

export const LoginFormContainer = connect(mapStateToProps, mapDispatchToProps)(LoginForm);
