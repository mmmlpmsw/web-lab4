import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { callBackend, callBackendWithoutLock } from '../../store/application/actions';
import { updateHistory } from '../../store/areaPage/actions';
import { AreaPage, AreaPageProps } from './AreaPage';
import { Session } from '../../models/session';
import { RootState } from '../../reducer';

type StateProps = Pick<AreaPageProps, 'session' | 'historyLength'>;

function mapStateToProps(state: RootState): StateProps {
    return {
        session: state.application.session,
        historyLength: state.areaPage.history.length
    };
}

type DispatchProps = Pick<AreaPageProps, 'reloadHistory'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        reloadHistory(session: Session): void {
            dispatch(callBackendWithoutLock(callBackend(
                'history/get',
                async fetch => {
                    const response = await fetch;

                    if (!response.ok) {
                        return;
                    }

                    dispatch(updateHistory(await response.json()));
                },
                session
            )));
        }
    };
}

export const AreaPageContainer = connect(mapStateToProps, mapDispatchToProps)(AreaPage);
