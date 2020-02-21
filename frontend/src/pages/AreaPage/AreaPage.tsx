import React from 'react';

import { Session } from '../../models/session';
import { GuardForAuthorized } from '../../components/Guard/GuardForAuthorized';
import { HistoryTableContainer } from '../../components/HistoryTable/HistoryTableContainer';
import { AreaFormContainer } from '../../components/AreaForm/AreaFormContainer';
import { AreaContainer } from '../../components/Area/AreaContainer';
import { Guard } from '../../components/Guard/Guard';

import './AreaPage.css';

export interface AreaPageProps {

    session?: Session;
    historyLength: number;

    reloadHistory(session: Session): void;
}

export class AreaPage extends React.Component<AreaPageProps> {

    private reloadInterval?: number;

    componentDidMount() {
        this.setReloadInterval();
    }

    componentDidUpdate(
        prevProps: Readonly<AreaPageProps>,
        prevState: Readonly<{}>,
        snapshot?: any
    ) {
        if (prevProps.session !== this.props.session) {
            this.setReloadInterval();
        }
    }

    private setReloadInterval() {
        const { session, reloadHistory } = this.props;

        if (this.reloadInterval !== undefined) {
            window.clearInterval(this.reloadInterval);
        }

        if (session !== undefined) {
            this.reloadInterval = window.setInterval(() => reloadHistory(session), 1000);
        } else {
            this.reloadInterval = undefined;
        }
    }

    render() {
        return (
            <GuardForAuthorized redirectUrl="/">
                <div className="area-page-main">
                    <div className="area-page-row">
                        <div className="area-container shadow-container">
                            <AreaContainer />
                        </div>

                        <div className="area-form-container shadow-container">
                            <AreaFormContainer />
                        </div>
                    </div>

                    <Guard isAllowed={this.props.historyLength > 0}>
                        <div className="history-table-container shadow-container">
                            <HistoryTableContainer />
                        </div>
                    </Guard>
                </div>
            </GuardForAuthorized>
        );
    }
}
