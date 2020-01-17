import React from "react";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';
import ErrorBox from '../componets/Settings/ErrorBox'
import Form from '../componets/Settings/Form'
import SaveButton from '../componets/Settings/SaveButton'
import LoadAnimation from '../componets/LoadAnimation'

const Settings = (state) => {
	const {store} = state;
	const {isLoad} = store;

	if (isLoad) return (<div><LoadAnimation isNoLabel={true}/></div>);

	return (
		<div>
			<h2>Settings</h2>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<ErrorBox/>
					<Form />
				</Grid>
			</Grid>
			<SaveButton />
		</div>
	);
};

export default connect(
	state => ({
		store : state.Settings,
	})
)(Settings);

