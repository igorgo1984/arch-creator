
import React from 'react';
import {connect}       from 'react-redux';
import Buttons         from '../componets/ProfileNew/Buttons'
import SaveFiles       from '../componets/ProfileNew/SaveFiles'
import SaveDir         from '../componets/ProfileNew/SaveDir'
import ErrorBox        from '../componets/ProfileNew/ErrorBox'
import IsUploadToCloud from '../componets/ProfileNew/IsUploadToCloud'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({ root : { margin : 15, } }));

const ProfileEdit = (state) => {
	const classes = useStyles();
	const { settings, profile, } = state;
	const {name} = profile;

	const isUpload = settings.OwnCloudUri.length ? <IsUploadToCloud /> : null ;

	return (
		<div className={classes.root}>
			<h1>Edit '{name}' archive profile</h1>
			<ErrorBox/>
			<SaveDir />
			<SaveFiles />
			{isUpload}
			<Buttons />
		</div>
	);
};

export default connect(
	state => ({
		profile  : state.ProfileNew,
		settings : state.Settings,
	}),
	dispatch => ({})
)(ProfileEdit);
