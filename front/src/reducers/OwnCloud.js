import {
	PREFIX_OWN_CLOUD as PREFIX
} from '../const/prefix'

const initialState = {
	isLoad : false,
	/**
	 * @type {Array<{
	 *     ContentType : string,
	 *     ETag : string,
	 *     Link : string,
	 *     Modified : string,
	 *     Size : string,
	 *     Status : string,
	 * }>}
	 */
	List : [],
	// table params
	order: 'desc',
	orderBy: 'name',
	selected: [],
	rowsPerPage : 20,
	page : 0,
	// -- table params
	search : '',
	header : [
		{ id: 'Action', numeric: false, disablePadding: true, label: 'Actions' },
		{ id: 'd/f', numeric: false,   disablePadding: false, label: 'Dir/File' },
		{ id: 'name', numeric: false,   disablePadding: false, label: 'Name' },
		{ id: 'Size', numeric: false,   disablePadding: false, label: 'Size' },
		{ id: 'Modified', numeric: false,   disablePadding: false, label: 'Modified' },
		{ id: 'ContentType', numeric: false,   disablePadding: false, label: 'ContentType' },
	],
};

const OwnCloud = (state = initialState, action) => {

	switch (action.type) {
		case `${PREFIX}_FILE_DELETE`:
			return {
				...state,
				List : state.List.filter(f => f.Link !== action.data)
			};
		case `${PREFIX}_CHANGE_FIELD`:
			return {
				...state,
				[action.data.field]:action.data.value
			};
		default:
			return state;
	}
};

export {OwnCloud};
