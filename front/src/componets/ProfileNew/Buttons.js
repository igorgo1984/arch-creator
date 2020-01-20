
import React        from 'react';
import {connect}    from 'react-redux';
import {makeStyles} from "@material-ui/core";
import {history}    from '../../configureStore'
import Button       from '@material-ui/core/Button';

import IconSave   from '@material-ui/icons/Save';
import IconCancel from '@material-ui/icons/Cancel';

import {
	PREFIX_NEW_PROFILE as PREFIX
} from '../../const/prefix'

import {
	PATH_PROFILE
} from '../../const/path'

import { alertBadEvent, alertOkEvent } from '../../const/alert'
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
		store, settings,
		// Dispatches
		setErrors, alert} = state;
	const { profiles } = settings;

	const {
		name,
		files,
		dirSave,
		isUploadToOwnCloud
	} = store;

	const handlerCancel = () => history.push(PATH_PROFILE);

	const handlerSave = async () => {
		let errors = [];

		setErrors(errors);

		try {
			if (!name.length) errors.push('Name is required');

			const hasProfile = profiles.find(
				p => p.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()
			);

			if (hasProfile !== undefined) errors.push(`Profile with name ${name} already exists`);

			if (!files.length) errors.push('No files for create archive');

			if (!dirSave.length) errors.push('No set dir save archive');

			if (errors.length) {
				setErrors(errors);
				return false
			}

			const response = await send('/new/profile', {
				name,
				files,
				dirSave,
				isUploadToOwnCloud
			});

			// TODO: clear NEED DOIT
			console.log('response ', response);

		} catch (e) {
			alert( alertBadEvent(e.message || e) )
		}
	};

	return (
		<div className={classes.root}>
			<Button className={classes.btn} variant={btnVariant}  color="secondary"
			        onClick={() => handlerCancel()}>
				<IconCancel /> Cancel
			</Button>
			<Button className={classes.btn} variant={btnVariant}  color="primary"
			        onClick={() => handlerSave()}>
				<IconSave /> Save
			</Button>
		</div>
	);
};

export default connect(
	state => ({
		store    : state.ProfileNew,
		settings : state.Settings,
	}),
	dispatch => ({
		alert : (data) => dispatch(data),
		setErrors : (data) => dispatch({type: `${PREFIX}_SET_ERRORS`, data})
	})
)(Buttons);
