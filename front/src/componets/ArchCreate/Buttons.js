
import React        from 'react';
import {connect}    from 'react-redux';
import {makeStyles} from "@material-ui/core";
import {history}    from '../../configureStore'
import Button       from '@material-ui/core/Button';

import IconArchive from '@material-ui/icons/Archive';
import IconCancel  from '@material-ui/icons/Cancel';

import {
	PREFIX_NEW_ARCHIVE as PREFIX,
} from '../../const/prefix'

import {
	PATH_PROFILE
} from '../../const/path'

import { alertBadEvent } from '../../const/alert'
import {send} from "../../tools/reqAstra";

const useStyles = makeStyles(theme => ({
	root : { margin : 15, },
	btn : { marginRight : 3,}
}));

const btnVariant = 'contained';

const Buttons = (state) => {
	const classes = useStyles();
	const {
		//Stores
		store,
		// Dispatches
		changeStoreField, alert
	} = state;

	const { profileName} = store;

	const handlerCancel = () => history.push(PATH_PROFILE);

	const handlerArchive = async () => {
		changeStoreField('isCreate', true);
		changeStoreField('report', {});

		try {
			const sendData = {profileName};
			const response = await send('/archive/new', sendData);

			changeStoreField('report', response.data)
		} catch (e) {
			alert( alertBadEvent(e.message || e) )
		} finally {
			changeStoreField('isCreate', false);
		}
	};

	return (
		<div className={classes.root}>
			<Button className={classes.btn} variant={btnVariant}  color="secondary"
			        onClick={() => handlerCancel()}>
				<IconCancel /> Cancel
			</Button>
			<Button className={classes.btn} variant={btnVariant}  color="primary"
			        onClick={() => handlerArchive()}>
				<IconArchive /> Create
			</Button>
		</div>
	);
};

export default connect(
	state => ({
		store    : state.ArchiveCreate,
	}),
	dispatch => ({
		alert : (data) => dispatch(data),
		changeStoreField : (field, value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data: {field, value}}),
	})
)(Buttons);
