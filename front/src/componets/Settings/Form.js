
import React from 'react';
import {connect} from 'react-redux';
import {
	InputLabel,
	InputAdornment,
	FormControl,
	Input,
	Typography,
	IconButton,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from '@material-ui/core';

import IconPath from '@material-ui/icons/GetApp';
import IconShow from '@material-ui/icons/Visibility';
import IconHide from '@material-ui/icons/VisibilityOff';
import IconCloudQueue from '@material-ui/icons/CloudQueue';
import IconPerson from '@material-ui/icons/Person';
import IconExpandMore from '@material-ui/icons/ExpandMore';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
	PREFIX_SETTINGS as PREFIX
} from '../../const/prefix'

import {
	showOpenDialog,
} from '../../tools/messageBox'

import {alertBadEvent} from "../../const/alert";
import {
	BG_COLOR_BLUE,
	COLOR_WHITE,
} from '../../const/colors'

const useStyles = makeStyles(theme => ({
	w100 : {
		width : '100%'
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	marginRight: {
		marginRight: theme.spacing(1),
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	headingPanel : {
		backgroundColor: BG_COLOR_BLUE,
		color: COLOR_WHITE
	},
}));

const Form = (state) => {
	const classes = useStyles();
	const {
		store,
		// actions
		alert,
		setDefaultDir,
		changeField
	} = state;

	const {
		defaultSaveArchDir,
		OwnCloudLogin,
		OwnCloudPassword,
		OwnCloudIsShowPassword,
		OwnCloudUri,
	} = store;

	const handlerChangeDefaultSaveDir = async () => {
		try {
			const paths = await showOpenDialog({
				title: "Select dir default archive for save",
				properties: ['openDirectory'],
			});

			if (!paths || !paths.length)
				return false;

			setDefaultDir(paths.pop())

		} catch (e) {
			alert(alertBadEvent( e.message ? e.message : e))
		}
	};
	const handlerChangeField = (field, value) => changeField({field, value});

	return (
		<div className={classes.root}>
			<ExpansionPanel className={classes.w100} >
				<ExpansionPanelSummary
					className={classes.headingPanel}
					expandIcon={<IconExpandMore />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<IconCloudQueue className={clsx(classes.marginRight)}/>
					<Typography className={classes.heading}>Own cloud section</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<div className={clsx(classes.w100)}>
						<FormControl fullWidth className={clsx(classes.margin, classes.w100)}>
							<InputLabel htmlFor="OwnCloudUri">Own cloud uri</InputLabel>
							<Input
								id="OwnCloudUri"
								value={OwnCloudUri}
								startAdornment={
									<InputAdornment position="start">
										<IconCloudQueue/>
									</InputAdornment>
								}
								onChange={
									(ev) => handlerChangeField('OwnCloudUri', ev.target.value)}
							/>
						</FormControl>
						<FormControl fullWidth className={clsx(classes.margin, classes.w100)}>
							<InputLabel htmlFor="OwnCloudLogin">Own cloud login</InputLabel>
							<Input
								id="OwnCloudLogin"
								value={OwnCloudLogin}
								startAdornment={
									<InputAdornment position="start">
										<IconPerson/>
									</InputAdornment>
								}
								onChange={(ev) => handlerChangeField('OwnCloudLogin', ev.target.value)}
							/>
						</FormControl>
						<FormControl fullWidth className={clsx(classes.margin, classes.w100)}>
							<InputLabel htmlFor="OwnCloudPassword">Own cloud password</InputLabel>
							<Input
								id="OwnCloudPassword"
								type={OwnCloudIsShowPassword ? 'text' : 'password'}
								value={OwnCloudPassword}
								onChange={(ev) => handlerChangeField('OwnCloudPassword', ev.target.value)}
								startAdornment={
									<InputAdornment position="start">
										<IconButton
											aria-label="toggle password visibility"
											onClick={ () => changeField({
												field :'OwnCloudIsShowPassword',
												value : !OwnCloudIsShowPassword
											}) }
										>
											{ OwnCloudIsShowPassword ? <IconHide /> : <IconShow /> }
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</div>

				</ExpansionPanelDetails>
			</ExpansionPanel>
			<FormControl fullWidth className={clsx(classes.margin, classes.w100)}>
				<InputLabel htmlFor="standard-adornment-password">Default archive dir save</InputLabel>
				<Input
					id="standard-adornment-password"
					value={defaultSaveArchDir}
					onChange={() => {console.log('Save form')}}
					startAdornment={
						<InputAdornment position="start">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => handlerChangeDefaultSaveDir()}
							>
								<IconPath/>
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>
		</div>
	);
};

export default connect(
	state => ({
		store: state.Settings
	}),
	dispatch => ({
		alert: (data) => dispatch(data),
		setDefaultDir : (data) => dispatch({type : `${PREFIX}_SET_DEFAULT_DIR`, data}),
		changeField : (data) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data}),
	})
)(Form);
