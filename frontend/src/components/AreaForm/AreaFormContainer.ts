import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AreaForm, AreaFormProps } from './AreaForm';
import { RootState } from '../../reducer';
import { sendQuery, updateForm, UpdateFormAction } from '../../store/areaPage/actions';

type StateProps = Pick<AreaFormProps, 'locked' | 'x' | 'y' | 'r'>;

function mapStateToProps(state: RootState): StateProps {
    return { locked: state.application.locked, ...state.areaPage.form };
}

type DispatchProps = Pick<AreaFormProps, 'onChange' | 'onSubmit'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onChange(property: UpdateFormAction['property'], value?: number | null) {
            dispatch(updateForm(property, value === null ? undefined : value));
        },

        onSubmit() {
            dispatch(sendQuery());
        }
    };
}

export const AreaFormContainer = connect(mapStateToProps, mapDispatchToProps)(AreaForm);
