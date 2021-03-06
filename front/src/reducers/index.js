import {combineReducers} from 'redux';
import {Alert}         from './Alert';
import {Menu}          from './Menu';
import {Settings}      from './Settings';
import {ProfileNew}    from './ProfileNew';
import {ArchiveCreate} from './ArchiveCreate';

import { routerReducer } from 'react-router-redux'

export default combineReducers({
	routing: routerReducer,
	ArchiveCreate,
	ProfileNew,
	Settings,
	Alert,
	Menu,
})
