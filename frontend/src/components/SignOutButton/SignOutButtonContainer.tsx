import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { SignOutButton, SignOutButtonProps } from './SignOutButton';
import { resetSession } from '../../store/application/actions';

type DispatchProps = Pick<SignOutButtonProps, 'onSignOut'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return { onSignOut() { dispatch(resetSession()); } };
}

export const SignOutButtonContainer = connect(undefined, mapDispatchToProps)(SignOutButton);
