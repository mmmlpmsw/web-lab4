import React from 'react';

import { TextField, TextFieldProps } from '../TextField/TextField';

export class PasswordField extends React.Component<TextFieldProps> {

    render() {
        return (
            <TextField type="password" {...this.props} />
        );
    }
}
