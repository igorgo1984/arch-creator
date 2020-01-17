import {combineReducers} from 'redux';
import {Alert} from './Alert';
import {Menu} from './Menu';
import {Settings} from './Settings';

import { routerReducer } from 'react-router-redux'

export default combineReducers({
	routing: routerReducer,
	Settings,
	Alert,
	Menu,
})
