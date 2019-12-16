import {createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { rootReducer } from '../reducers/ rootReducer';


// This is used for the show the redux action logs
// import {createLogger} from 'redux-logger';
// const loggerMiddleware= createLogger();

/*
* Accepting only one root reduces
* createLogger for state action monitoring.. 
*/
export default function configureStore(preLoadedState) {
    return createStore(
        rootReducer,
        preLoadedState,
        applyMiddleware(thunkMiddleware)
    );    
}