import React          from 'react';
import clsx           from 'clsx';
import {connect}      from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

import ErrorIcon       from '@material-ui/icons/Error';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const variantIcon = {error: ErrorIcon,};

const useStyles = makeStyles(theme => ({
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	icon: { fontSize: 20 },
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
		width : '100%',
	},
}));

const ErrorBox = (state) => {
	const classes = useStyles();
	const { store } = state;
	const {errorMessages } = store;
	const Icon = variantIcon.error;

	if (!errorMessages.length) return false;

	return (
		<SnackbarContent
			className={clsx(classes.error)}
			aria-describedby="client-snackbar"
			message={
				<div>
					<div id="client-snackbar" className={classes.message}>
						<Icon className={clsx(classes.icon, classes.iconVariant)} /> Validation errors:
					</div>
					{errorMessages.map((m) => (<div key={`err_mess_${m}`}>{m}</div>))}
				</div>
			}
		/>
	);
};
export default connect(
	state => ({
		store : state.ProfileNew,
	})
)(ErrorBox);
