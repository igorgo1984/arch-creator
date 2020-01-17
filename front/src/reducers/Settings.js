import {
	PREFIX_SETTINGS as PREFIX,
} from '../const/prefix'

const initialState = {
	isLoad : false,
	defaultSaveArchDir : '',
	OwnCloudLogin    : '',
	OwnCloudPassword : '',
	OwnCloudIsShowPassword : false,
	OwnCloudUri      : '',
	errorMessages : [],
};

const Settings = (state = initialState, action) => {
	switch (action.type) {
		case `${PREFIX}_SET_LOAD`:
			return {
				...state,
				isLoad : action.data
			};
		case `${PREFIX}_CHANGE_FIELD`:
			return {
				...state,
				[action.data.field] : action.data.value,
			};
		case `${PREFIX}_SET_DEFAULT_DIR`:
			return {
				...state,
				defaultSaveArchDir : action.data
			};
		case `${PREFIX}_SET_ERRORS`:
			return {
				...state,
				errorMessages : action.data
			};

		default:
			return state;
	}
};

export {Settings}
