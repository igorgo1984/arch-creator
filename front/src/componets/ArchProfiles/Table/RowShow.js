import React from 'react'
import {connect} from 'react-redux'
import {
	PREFIX_ALERT as ALERT,
	PREFIX_SETTINGS as PREFIX} from "../../../const/prefix";
import {withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GetPathIcon from '@material-ui/icons/GetApp';
import {ICON_TYPES, TYPES} from "../../../const/alert";
import LoadAnimation from '../../LoadAnimation';

const RowShow = (state) => {
	const {row, store,} = state;
	const { isLoad, loadRow } = store;

	const handleDownload = async () => {
		// try {
		//
		// } catch (e) {
		// 	state.showError(e.message || e);
		// } finally {
		// 	state.loadStop();
		// }
	};

	const handleEdit = () => {
		state.edit(row.id)
	};

	const handleDelete = async () => {
		state.load(row.id);

		// try {
		//
		// } catch (e) {
		// 	state.showError(e.message || e);
		// } finally {
		// 	state.loadStop();
		// }
	};

	return (
		<TableRow
			hover
			tabIndex={-1}
			key={row.id}
		>
			<TableCell>
				{
					isLoad && loadRow === row.id
						? <LoadAnimation/>
						: [
							(
								<Tooltip title="Delete"  key={row.id + '_tl_delete'}>
									<IconButton aria-label="Delete" onClick={handleDelete}  key={row.id + '_delete'}>
										<DeleteIcon key={row.id + '_ico_delete'}/>
									</IconButton>
								</Tooltip>
							),
							(
								<Tooltip title="Edit" key={row.id + '_tl_edit'}>
									<IconButton aria-label="Edit" onClick={handleEdit} key={row.id + '_edit'}>
										<EditIcon key={row.id + '_ico_edit'}/>
									</IconButton>
								</Tooltip >
							),
							(
								<Tooltip title="Download" key={row.id + '_tl_download'}>
									<IconButton aria-label="Download" onClick={() => handleDownload()} key={row.id + '_download'}>
										<GetPathIcon key={row.id + '_ico_download'}/>
									</IconButton>
								</Tooltip>
							),
						]
				}
			</TableCell>
			<TableCell component="th" scope="row" padding="none" >
				{row.name}
			</TableCell>
			<TableCell >Name</TableCell>
		</TableRow>
	);
};

export default connect(
	state => ({
		store : state.Settings,
	}),
	dispatch => ({
		load      : (data) => dispatch({type : `${PREFIX}_TABLE_LOAD`, data}),
		loadStop  : () => dispatch({type : `${PREFIX}_TABLE_LOAD_STOP`}),
		edit      : (rowId) => dispatch({type : `${PREFIX}_EDIT_ROW`, data: rowId}),
		delete    : (rowId) => dispatch({type : `${PREFIX}_ROW_DELETE`, data: rowId}),
		showError : message => dispatch({
			type : `${ALERT}_OPEN`,
			data : {
				message,
				showIcon : ICON_TYPES.BAD,
				type : TYPES.BAD
			}
		})
	})
)(withStyles(theme => ({}))(RowShow))
