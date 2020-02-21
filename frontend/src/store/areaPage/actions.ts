import { Action } from 'redux';

import { Query } from '../../models/query';

export enum AreaPageActionType {

    ADD_QUERY = 'ADD_QUERY',
    SEND_QUERY = 'SEND_QUERY',

    UPDATE_HISTORY = 'UPDATE_HISTORY',

    UPDATE_FORM = 'UPDATE_FORM',
    CLEAN = 'CLEAN'
}

export interface AddQueryAction extends Action<AreaPageActionType.ADD_QUERY> {

    query: Query;
}

export interface SendQueryAction extends Action<AreaPageActionType.SEND_QUERY> {

    x?: number;
    y?: number;
    r?: number;
}

export interface UpdateHistoryAction extends Action<AreaPageActionType.UPDATE_HISTORY> {

    history: Query[];
}

export interface UpdateFormAction extends Action<AreaPageActionType.UPDATE_FORM> {

    property: 'x' | 'y' | 'r';
    value?: number;
}

export interface CleanAction extends Action<AreaPageActionType.CLEAN> {}

export type AreaPageAction = AddQueryAction | SendQueryAction |
    UpdateHistoryAction | UpdateFormAction | CleanAction;

export function addQuery(query: Query): AddQueryAction {
    return { type: AreaPageActionType.ADD_QUERY, query };
}

export function sendQuery(x?: number, y?: number, r?: number): SendQueryAction {
    return { type: AreaPageActionType.SEND_QUERY, x, y, r };
}

export function updateHistory(history: Query[]): UpdateHistoryAction {
    return { type: AreaPageActionType.UPDATE_HISTORY, history };
}

export function updateForm(property: UpdateFormAction['property'], value?: number): UpdateFormAction {
    return { type: AreaPageActionType.UPDATE_FORM, property, value };
}

export function clean(): CleanAction {
    return { type: AreaPageActionType.CLEAN };
}
