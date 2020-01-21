import {
	PREFIX_NEW_ARCHIVE as PREFIX
} from '../const/prefix'

const initialState = {
	profileName : '',
	isCreate : false,
	report : {}
};

const ArchiveCreate = (state = initialState, action) => {

	switch (action.type) {
		case `${PREFIX}_CHANGE_FIELD`:
			return {
				...state,
				[action.data.field] : action.data.value
			};
		case `${PREFIX}_USE_PROFILE`:
			return {
				...state,
				profileName : action.data
			};
		default:
			return state;
	}
};

export {ArchiveCreate};

