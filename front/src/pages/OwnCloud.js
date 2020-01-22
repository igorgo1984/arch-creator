import React, {Component} from 'react';
import {connect}      from 'react-redux';
import { withStyles } from '@material-ui/styles';
import LoadAnimation from '../componets/LoadAnimation'
import Table from '../componets/OwnCloud/Table/Table'

import {
	COLOR_RED
} from '../const/colors';
import {
	PREFIX_OWN_CLOUD as PREFIX
} from '../const/prefix';
import {
	alertBadEvent
} from '../const/alert';
import {
	send
} from '../tools/reqAstra';

class OwnCloud extends Component {

	async componentWillMount() {
		const {alert, changeField} = this.props;

		try {
			changeField('isLoad', true);

			const response = await send('/own-cloud/root/list');
			changeField('List', response.data.List || []);

		} catch (e) {
			alert(alertBadEvent(e.message || e))
		} finally {
			changeField('isLoad', false)
		}
	}

	render () {
		const {
			store, settings, classes
		} = this.props;

		const { OwnCloudUri } = settings;

		if (!OwnCloudUri.length) {
			return (
				<div>
					<h1 className={classes.noInclude}>OwnCloud not include</h1>
				</div>
			);
		}

		const {
			isLoad
		} = store;

		const content = isLoad
			? (<LoadAnimation/>)
			: (
				<div>
					<Table />
				</div>
			);

		return (
			<div>
				<h1>OwnCloud</h1>
				{content}
			</div>
		);
	}
}

export default connect(
	state => ({
		store: state.OwnCloud,
		settings : state.Settings,
	}),
	dispatch => ({
		alert : (data) => dispatch(data),
		changeField : (field, value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data : {field, value} }),
	})
)(withStyles({
	noInclude : { color: COLOR_RED, },
})(OwnCloud));
