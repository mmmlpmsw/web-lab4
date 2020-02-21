import { connect } from 'react-redux';

import { HistoryTable, HistoryTableProps } from './HistoryTable';
import { RootState } from '../../reducer';

type StateProps = Pick<HistoryTableProps, 'history'>;

function mapStateToProps(state: RootState): StateProps {
    return { history: state.areaPage.history };
}

export const HistoryTableContainer = connect(mapStateToProps)(HistoryTable);
