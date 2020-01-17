
import React from 'react';
import {connect} from 'react-redux';
import IconSave from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core";
import {send} from '../../tools/reqAstra';
import {alertBadEvent, alertOkEvent} from "../../const/alert";
import {
	PREFIX_SETTINGS as PREFIX
} from '../../const/prefix'

const useStyles = makeStyles(theme => ({
	root : {
		margin : 15,
	}
}));

const SaveButton = (state) => {
	const classes = useStyles();
	const {store} = state;
	const {
		crypt,
		credentials,
		dirSave,
		files,
	} = store;

	const handlerClick = async () => {
		let errors = [];
		state.setErrors(errors);

		if (crypt.value.length !== 32) {
			errors.push('Field crypt is required and must have length 32')
		}

		if (!credentials.isHas) {
			errors.push('Need set google credentials')
		}

		if (!credentials.isInit) {
			errors.push('Need initialization google credentials')
		}

		if (!dirSave.id.length) {
			errors.push('Need selected store dir in google')
		}

		if (!files.length) {
			errors.push('For archive need chouse files or dirs')
		}

		if (errors.length) {
			state.setErrors(errors);
			return false;
		}

		const sendData = {
			crypt : crypt.value,
			dirSave,
			files,
		}

		try {
			const response = await send('/app/config/set', sendData);
			// TODO: clear
			console.log('response  ', response);
			state.alert(alertOkEvent('Config updated'))
		} catch (e) {
			state.alert(alertBadEvent(e.message || e))
		}
	}

	return (
		<div className={classes.root}>
			<Button variant="contained"  color="primary" onClick={() => handlerClick()}>
				<IconSave />Save
			</Button>
		</div>
	);
};

export default connect(
	state => ({
		store: state.Settings,
	}),
	dispatch => ({
		setErrors : (data) => dispatch({type : `${PREFIX}_SET_ERRORS`, data}),
		alert : (data) => dispatch(data),
	})
)(SaveButton);
