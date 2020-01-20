
import React from 'react';
import {connect}       from 'react-redux';
import Buttons         from '../componets/ProfileNew/Buttons'
import SaveFiles       from '../componets/ProfileNew/SaveFiles'
import SaveDir         from '../componets/ProfileNew/SaveDir'
import Name            from '../componets/ProfileNew/Name'
import ErrorBox        from '../componets/ProfileNew/ErrorBox'
import IsUploadToCloud from '../componets/ProfileNew/IsUploadToCloud'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({ root : { margin : 15, } }));

const ProfileNew = (state) => {
	const classes = useStyles();
	const {
		settings,
	} = state;

	const isUpload = settings.OwnCloudUri.length ? <IsUploadToCloud /> : null ;

	return (
		<div className={classes.root}>
			<h1>New archive profile</h1>
			<ErrorBox/>
			<Name />
			<SaveDir />
			<SaveFiles />
			{isUpload}
			<Buttons />
		</div>
	);
};

export default connect(
	state => ({
		settings: state.Settings,
	}),
	dispatch => ({})
)(ProfileNew);
