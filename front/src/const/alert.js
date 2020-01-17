import {
	PREFIX_ALERT as ALERT,
} from './prefix'

const TYPES = {
	OK   : 'OK',
	BAD  : 'BAD',
	WARN : 'WARN',
};

const ICON_TYPES = {
	OK   : 'OK',
	BAD  : 'BAD',
	WARN : 'WARN',
};

const alertBadEvent = (message) => ({
	type: `${ALERT}_OPEN`,
	data: {
		message,
		showIcon: ICON_TYPES.BAD,
		type: TYPES.BAD
	}
});

const alertOkEvent = (message) => ({
	type: `${ALERT}_OPEN`,
	data: {
		message,
		showIcon: ICON_TYPES.OK,
		type: TYPES.OK
	}
});

export {
	ICON_TYPES,
	TYPES,
	alertBadEvent,
	alertOkEvent
}
