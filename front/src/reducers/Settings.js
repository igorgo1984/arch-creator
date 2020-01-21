import {
	PREFIX_SETTINGS as PREFIX,
} from '../const/prefix'

const initialState = {
	isLoad : false,
	// table params
	order: 'desc',
	orderBy: 'name',
	selected: [],
	rowsPerPage : 20,
	page : 0,
	// -- table params
	search : '',

	defaultSaveArchDir     : '',
	OwnCloudLogin          : '',
	OwnCloudPassword       : '',
	OwnCloudIsShowPassword : false,
	OwnCloudUri            : '',
	profiles      : [],
	errorMessages : [],
	header : [
		{ id: 'Action', numeric: false, disablePadding: true, label: 'Actions' },
		{ id: 'name', numeric: false,   disablePadding: false, label: 'Name' },
	],
};

const Settings = (state = initialState, action) => {
	switch (action.type) {
		case `${PREFIX}_EDIT_PROFILE`:
			return {
				...state,
				profiles : state.profiles.map(p => {
					if (p.name === action.data.name) {
						p.files = action.data.files;
						p.dirSave = action.data.dirSave;
						p.isUploadToOwnCloud = action.data.isUploadToOwnCloud;
					}

					return p;
				})
			};
		case `${PREFIX}_PROFILE_CHANGE_ACTIVE`:
			return {
				...state,
				profiles : state.profiles.map(p => {
					if (p.name === action.data.name) {
						p.isActive = action.data.isActive
					}

					return p;
				})
			};
		case `${PREFIX}_PROFILE_DELETE`:
			return {
				...state,
				profiles : state.profiles.filter(p => p.name !== action.data)
			};
		case `${PREFIX}_NEW_PROFILE`:
			return {
				...state,
				profiles : state.profiles.concat([action.data])
			};
		case `${PREFIX}_CHANGE_SEARCH`:
			return {
				...state,
				search : action.data
			};
		case `${PREFIX}_SET_APP_CONFIG`:
			const {
				defaultSaveArchDir,
				ownCloudLogin,
				ownCloudPassword,
				ownCloudUri,
				profiles,
			} = action.data;

			return {
				...state,
				profiles           : profiles || [],
				defaultSaveArchDir : defaultSaveArchDir || '',
				OwnCloudLogin      : ownCloudLogin      || '',
				OwnCloudPassword   : ownCloudPassword   || '',
				OwnCloudUri        : ownCloudUri        || '',
			};

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
