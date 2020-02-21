import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Area, AreaProps } from './Area';
import { RootState } from '../../reducer';
import { sendQuery } from '../../store/areaPage/actions';

type StateProps = Pick<AreaProps, 'locked' | 'history' | 'form'>;

function mapStateToProps(state: RootState): StateProps {
    return {
        locked: state.application.locked,

        history: state.areaPage.history,
        form: state.areaPage.form
    };
}

type DispatchProps = Pick<AreaProps, 'onSubmit'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onSubmit(x: number, y: number) {
            dispatch(sendQuery(x, y));
        }
    }
}

export const AreaContainer = connect(mapStateToProps, mapDispatchToProps)(Area);
