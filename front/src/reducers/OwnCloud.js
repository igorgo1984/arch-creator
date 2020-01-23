import {
	PREFIX_OWN_CLOUD as PREFIX
} from '../const/prefix'
import {basename} from "path";

const initialState = {
	isRoot : false,
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
	CurrentDir : '/remote.php/webdav/',
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
		case `${PREFIX}_SET_LIST`:
			let  isRoot = state.CurrentDir === '/remote.php/webdav/';
			const RootDirName = Symbol("RootDir");

			let list = (action.data || []).map(row => {
				const pathClear = row.Link.replace('/remote.php/webdav', '');

				row.isDir = pathClear.substr(-1, 1) === '/';

				row.name = row.isDir
					? basename(pathClear.substr(0, pathClear.length - 1 ))
					: basename(pathClear);

				if (row.isDir && row.name === '') {
					isRoot   = true;
					row.name = RootDirName
				}

				return row;
			});

			if (isRoot) {
				list = list.filter(f => f.name !== RootDirName);
			} else {
				list =[{
					 ContentType : '',
					 ETag        : '',
					 Link        : '',
					 Modified    : '',
					 Size        : '',
					 Status      : '',
					 name        : '..',
					 isDir       : true
				}, ...list]
			}

			let NewState = {...state, List : list, isRoot};

			if (isRoot) NewState.CurrentDir = '/remote.php/webdav/';

			return NewState;

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
