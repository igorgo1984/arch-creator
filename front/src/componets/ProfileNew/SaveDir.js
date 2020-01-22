
import React from 'react';
import {connect} from 'react-redux';
import {
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	makeStyles
} from "@material-ui/core";

import clsx from "clsx";
import IconPath from "@material-ui/icons/GetApp";
import {PREFIX_NEW_PROFILE as PREFIX} from "../../const/prefix";
import {showOpenDialog} from "../../tools/messageBox";
import {alertBadEvent} from "../../const/alert";

const useStyles = makeStyles(theme => ({
	root: { width: '100%', },
}));

const SaveDir = (state) => {
	const classes  = useStyles();

	const { store, changeDir } = state;
	const { dirSave } = store;

	const handlerChangeDir = async () => {
		try {
			const paths = await showOpenDialog({
				title: "Select dir default archive for save",
				properties: ['openDirectory', 'showHiddenFiles'],
				defaultPath: dirSave,
			});

			if (!paths || !paths.length)
				return false;

			changeDir(paths.pop())

		} catch (e) {
			alert(alertBadEvent( e.message ? e.message : e))
		}
	};

	return (
		<div className={classes.root}>
			<FormControl fullWidth className={clsx(classes.margin, classes.w100)}>
				<InputLabel htmlFor="standard-adornment-password">Archive save folder</InputLabel>
				<Input
					id="standard-adornment-password"
					value={dirSave}
					onChange={(ev) => changeDir(ev.target.value)}
					startAdornment={
						<InputAdornment position="start">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => handlerChangeDir()}
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
		store: state.ProfileNew
	}),
	dispatch => ({
		changeDir : (value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data :{value, field: 'dirSave'} }),
	})
)(SaveDir);
