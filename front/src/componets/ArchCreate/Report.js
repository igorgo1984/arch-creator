
import React from 'react';
import {connect} from 'react-redux';

const Report = (state) => {
	const {store}  = state;
	const {report} = store;

	let text = null;

	if (Object.keys(report).length) {
		text = [];
		for (const [operation, message] of Object.entries(report)) {
			text.push(<div key={`report_` + operation}>{operation} : {message}</div>);
		}
	}

	return (<div>{text}</div>);
};

export default connect(
	state => ({
		store: state.ArchiveCreate
	})
)(Report);
