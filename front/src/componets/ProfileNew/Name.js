
import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from "@material-ui/core";
import {
	TextField
} from "@material-ui/core";
import {
	PREFIX_NEW_PROFILE as PREFIX
} from '../../const/prefix'

const useStyles = makeStyles(theme => ({
	root: { width: '100%', },
}));

const Name = (state) => {
	const classes = useStyles();
	const { store, changeName } = state;
	const { name } = store;

	return (
		<div className={classes.root}>
			<TextField fullWidth
				value={name}
				label={'Enter profile name'}
				onChange={ev => changeName(ev.target.value)}
			/>
		</div>
	);
};

export default connect(
	state => ({
		store: state.ProfileNew,
	}),
	dispatch => ({
		changeName : (value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data : {value, field : 'name'}}),
	})
)(Name);
