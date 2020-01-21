import React from 'react';
import {connect} from 'react-redux';
import Buttons from '../componets/ArchCreate/Buttons'
import Report from '../componets/ArchCreate/Report'

import LoadAnimation from '../componets/LoadAnimation'

const ArchiveCreate = (state) => {
	const {store} = state;
	const {profileName, isCreate} = store;

	let content;

	if (isCreate) {
		content = <LoadAnimation />
	} else {
		content = (<div>
			<Buttons/>
			<Report />
		</div>)
	}

	return (
		<div>
			<h1>Create archive. Use profile {profileName}</h1>
			{content}
		</div>
	);
};

export default connect(
	state => ({
		store: state.ArchiveCreate,
	})
)(ArchiveCreate);
