import { Action, Middleware, MiddlewareAPI } from 'redux';

export type ActionHandler<T = any> = (action: T, store: MiddlewareAPI) => void;

const handlers: Map<any, ActionHandler> = new Map();

export const actionHandler: Middleware = store => next => (action: Action) => {
    const handler = handlers.get(action.type);

    if (handler) {
        handler(action, store);
    }

    next(action);
};

export function registerHandler(handler: ActionHandler, ...actionTypes: any) {
    actionTypes.forEach((actionType: any) => handlers.set(actionType, handler));
}
