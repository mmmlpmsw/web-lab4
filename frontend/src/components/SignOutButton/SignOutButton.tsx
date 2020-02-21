import React from 'react';
import { Button } from 'react-toolbox/lib/button';

export interface SignOutButtonProps {

    onSignOut(): void;
}

export class SignOutButton extends React.Component<SignOutButtonProps, any> {

    render() {
        return (
            <Button label="Выход" onClick={this.props.onSignOut} raised />
        );
    }
}
