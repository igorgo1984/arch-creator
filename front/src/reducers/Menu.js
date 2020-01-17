import {
	PREFIX_MENU as PREFIX,
	PREFIX_UPDATE_LOCATION,
} from '../const/prefix'

const initialState = {
	isOpen   : true,
	location : false,
};

const Menu = (state = initialState, action) => {
	// eslint-disable-next-line
	switch (action.type) {
		case `${PREFIX}_OPEN`:
			return {
				...state,
				isOpen : true
			};

		case `${PREFIX}_CLOSE`:
			return {
				...state,
				isOpen : false
			};

		case PREFIX_UPDATE_LOCATION:
			return {
				...state,
				location: action.location
			};
	}

	return state;
};

export {Menu};
