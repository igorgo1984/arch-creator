
import React from 'react';
import {connect} from 'react-redux';
import IconSave from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core";
import {send} from '../../tools/reqAstra';
import {alertBadEvent, alertOkEvent} from "../../const/alert";

const useStyles = makeStyles(theme => ({
	root : {
		margin : 15,
	}
}));

const SaveButton = (state) => {
	const classes = useStyles();
	const {store} = state;
	const {
		defaultSaveArchDir,
		OwnCloudLogin,
		OwnCloudPassword,
		OwnCloudUri,
	} = store;

	const handlerClick = async () => {

		const sendData = {
			defaultSaveArchDir,
			OwnCloudLogin,
			OwnCloudPassword,
			OwnCloudUri,
		};

		try {
			await send('/app/config/set', sendData);

			state.alert(alertOkEvent('Config updated'))
		} catch (e) {
			state.alert(alertBadEvent(e.message || e))
		}
	};

	return (
		<div className={classes.root}>
			<Button variant="contained"  color="primary" onClick={() => handlerClick()}>
				<IconSave /> Save
			</Button>
		</div>
	);
};

export default connect(
	state => ({
		store: state.Settings,
	}),
	dispatch => ({
		alert : (data) => dispatch(data),
	})
)(SaveButton);
