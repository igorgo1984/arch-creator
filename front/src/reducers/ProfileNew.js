import {
	PREFIX_NEW_PROFILE as PREFIX
} from '../const/prefix'
const initialState = {
	name : '',
	files : [],
	dirSave : '',
	isUploadToOwnCloud : false,
	errorMessages : [],
};

const ProfileNew = (state = initialState, action) => {

	switch (action.type) {
		case `${PREFIX}_SET_ERRORS`:
			return {
				...state,
				errorMessages : action.data
			};
		case `${PREFIX}_DEFAULT_DIR_SAVE`:
			return {
				...initialState,
				dirSave : action.data
			};
		case `${PREFIX}_MOVE_FILE_FROM_LIST`:
			return {
				...state,
				files : state.files.filter(f => f !== action.data )
			};
		case `${PREFIX}_ADD_FILES_TO_ARCH`:
			return {
				...state,
				files : state.files.concat(action.data || [])
			};
		case `${PREFIX}_CHANGE_FIELD`:
			return {
				...state,
				[action.data.field] : action.data.value
			};
		default:
			return state;
	}

};

export {ProfileNew};
