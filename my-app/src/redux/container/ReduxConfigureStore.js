import {createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import { rootReducer } from '../reducers/ rootReducer';


const loggerMiddleware= createLogger();
/*
* Accepting only one root reduces
* createLogger for state action monitoring.. 
*/
export default function configureStore(preLoadedState) {
    return createStore(
        rootReducer,
        preLoadedState,
        applyMiddleware(thunkMiddleware,loggerMiddleware)
    );    
}