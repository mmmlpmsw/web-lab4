import { AreaPageAction, AreaPageActionType } from './actions';
import { Query } from '../../models/query';

export interface AreaPageState {

    history: Query[];

    form: {
        x?: number;
        y?: number;
        r?: number;
    }
}

const initialState: AreaPageState = {

    history: [],
    form: {}
};

export function areaPage(state: AreaPageState = initialState, action: AreaPageAction): AreaPageState {
    switch (action.type) {
        case AreaPageActionType.ADD_QUERY:
            if (state.history.length === 0 || !compareQueries(action.query, state.history[state.history.length - 1])) {
                return { ...state, history: [...state.history, action.query] };
            } else {
                break;
            }

        case AreaPageActionType.UPDATE_HISTORY:
            return { ...state, history: action.history };

        case AreaPageActionType.UPDATE_FORM:
            if (
                action.value === undefined ||
                (action.property === 'x' && action.value > -5 && action.value < 5) ||
                (action.property === 'y' && action.value > -3 && action.value < 5) ||
                (action.property === 'r' && action.value > -5 && action.value < 5)
            ) {
                return { ...state, form: { ...state.form, [action.property]: action.value } };
            } else {
                return { ...state, form: { ...state.form, [action.property]: undefined } };
            }

        case AreaPageActionType.CLEAN:
            return { ...state, history: [], form: {} };
    }

    return state;
}

function compareQueries(a: Query, b: Query) {
    return a.x === b.x && a.y === b.y && a.r === b.r;
}
