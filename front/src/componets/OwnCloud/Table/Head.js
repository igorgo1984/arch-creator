import React from 'react';
import {connect} from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow  from '@material-ui/core/TableRow';
import Tooltip   from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {withStyles}   from "@material-ui/core";
import {classes}      from "../../../const/styles";
import {PREFIX_SETTINGS as PREFIX} from '../../../const/prefix'
import {OwnCloud} from "../../../reducers/OwnCloud";

const EnhancedTableHead = (state) => {
	const { order, orderBy, header:rows } = state.store;
	const createSortHandler = property => event => state.setOrder(
		property,
		(orderBy === property && order === 'desc') ? 'asc' : 'desc'
	);

	return (
		<TableHead>
			<TableRow>
				{rows.map(row => {
					// Other has react warning
					const isNumericString = row.numeric || false ? 'true' : 'false';

					return (
						<TableCell
							key={row.id}
							numeric={isNumericString}
							padding={'default'}
							sortDirection={orderBy === row.id ? order : false}
						>
							<Tooltip
								title="Sort"
								placement={isNumericString ? 'bottom-end' : 'bottom-start'}
								enterDelay={300}
							>
								<TableSortLabel

									active={orderBy === row.id}
									direction={order}
									onClick={createSortHandler(row.id)}
								>
									<span style={{paddingLeft: 10}}>{row.label}</span>
								</TableSortLabel>
							</Tooltip>
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
};

export default connect(
	state => ({
		store : state.OwnCloud,
	}),
	dispatch => ({
		setOrder : (orderBy, order) => dispatch({type : `${PREFIX}_SET_ORDER`, data: {orderBy, order}}),
	})
)(withStyles(classes, { withTheme: true })(EnhancedTableHead))
