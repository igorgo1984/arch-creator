import React from 'react';
import {connect} from 'react-redux';
import Table from '../componets/ArchProfiles/Table/Table'

const Profiles = (state) => {
	return (
		<div>
			<h1>Archive profiles</h1>
			<Table />
		</div>
	);
};

export default connect(
	state => ({
		store: state.Settings,
	})
)(Profiles);
