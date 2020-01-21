
import React        from 'react';
import {connect}    from 'react-redux';
import {makeStyles} from "@material-ui/core";
import {history}    from '../../configureStore'
import Button       from '@material-ui/core/Button';

import IconSave   from '@material-ui/icons/Save';
import IconCancel from '@material-ui/icons/Cancel';

import {
	PREFIX_NEW_PROFILE as PREFIX,
	PREFIX_SETTINGS as SETTINGS
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
		store, settings,
		// Dispatches
		updateProfile, newProfile, setErrors, alert} = state;
	const { profiles } = settings;

	const {
		isNew,
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
			if (isNew) {
				if (!name.length) errors.push('Name is required');

				const hasProfile = profiles.find(
					p => p.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()
				);

				if (hasProfile !== undefined) errors.push(`Profile with name ${name} already exists`);
			}

			if (!files.length) errors.push('No files for create archive');

			if (!dirSave.length) errors.push('No set dir save archive');

			if (errors.length) {
				setErrors(errors);
				return false
			}

			const sendData = {
				name,
				files,
				dirSave,
				isUploadToOwnCloud
			};

			if (isNew) {
				await send('/new/profile', sendData);
				newProfile({ ...sendData, isActive : false });
			} else {
				await send('/edit/profile', sendData);
				updateProfile(sendData);
			}

			await history.push(PATH_PROFILE);

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
		updateProfile : (data) => dispatch({type: `${SETTINGS}_EDIT_PROFILE`, data}),
		newProfile : (data) => dispatch({type: `${SETTINGS}_NEW_PROFILE`, data}),
		setErrors : (data) => dispatch({type: `${PREFIX}_SET_ERRORS`, data}),
	})
)(Buttons);
