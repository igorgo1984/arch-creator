import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers'
import { createBrowserHistory as createHistory } from 'history';
import {routerMiddleware, syncHistoryWithStore} from "react-router-redux";

const loggerMiddleware = createLogger();
const browserHistory = createHistory();

const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware,
			routerMiddleware(browserHistory)
		))
);

const history = syncHistoryWithStore(browserHistory, store);

export {
	store,
	history,
}
