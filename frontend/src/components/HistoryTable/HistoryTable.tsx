import React from 'react';

import { Query } from '../../models/query';

import './HistoryTable.css';

export interface HistoryTableProps {

    history: Query[];
}

export class HistoryTable extends React.Component<HistoryTableProps> {

    render() {
        const { history } = this.props;

        return (
            <table className="history-table">
                <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Результат</th>
                </tr>
                </thead>

                <tbody>
                {[...history].reverse().map((query, i) => (
                    <tr key={i}>
                        <td className="wrap-all">{query.x}</td>
                        <td className="wrap-all">{query.y}</td>
                        <td className="wrap-all">{query.r}</td>
                        <td className="no-wrap">{query.result ? 'коту тепло и уютно' : 'коту холодно'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}
