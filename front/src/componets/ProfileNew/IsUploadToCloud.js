import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {
	FormControlLabel,
	Checkbox,
} from "@material-ui/core";
import {PREFIX_NEW_PROFILE as PREFIX} from "../../const/prefix";

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
}));
const IsUploadToCloud = (state) => {
	const classes = useStyles();
	const {
		store,
		setField
	} = state;
	const {
		isUploadToOwnCloud
	} = store;

	return (
		<div className={classes.root}>
			<FormControlLabel
				control={
					<Checkbox
						checked={isUploadToOwnCloud}
						onChange={() => setField('isUploadToOwnCloud', !isUploadToOwnCloud)}
						value={isUploadToOwnCloud}
						color="primary"
					/>
				}
				label="Upload new archive to owncloud after create."
			/>
		</div>
	);
};

export default connect(
	state => ({
		store: state.ProfileNew,
	}),
	dispatch => ({
		setField: (field, value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data : {field, value} })
	})
)(IsUploadToCloud);
