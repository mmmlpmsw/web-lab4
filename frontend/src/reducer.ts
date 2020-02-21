import { combineReducers } from 'redux';

import { application } from './store/application/reducer';
import { areaPage } from './store/areaPage/reducer';

export const rootReducer = combineReducers({ application, areaPage });

export type RootState = ReturnType<typeof rootReducer>;
