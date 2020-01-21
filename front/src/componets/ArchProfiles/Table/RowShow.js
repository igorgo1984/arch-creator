import React from 'react'
import {connect} from 'react-redux'
import {
	PREFIX_ALERT       as ALERT,
	PREFIX_NEW_PROFILE as PROFILE,
	PREFIX_NEW_ARCHIVE as ARCH_NEW,
	PREFIX_SETTINGS    as PREFIX
} from "../../../const/prefix";
import {
	PATH_PROFILE_EDIT,
	PATH_ARCH_NEW,
} from "../../../const/path";
import {history} from "../../../configureStore";
import {withStyles} from "@material-ui/core";

import TableRow  from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip   from "@material-ui/core/Tooltip";

import IconButton  from "@material-ui/core/IconButton";
import EditIcon    from '@material-ui/icons/Edit';
import DeleteIcon  from '@material-ui/icons/Delete';
import IconOn      from '@material-ui/icons/FlashOn';
import IconOff     from '@material-ui/icons/FlashOff';
import IconArchive from '@material-ui/icons/Archive';

import {ICON_TYPES, TYPES} from "../../../const/alert";
import LoadAnimation       from '../../LoadAnimation';
import {send}              from "../../../tools/reqAstra";

const RowShow = (state) => {
	const {row, store,} = state;
	const { isLoad, loadRow } = store;

	const handleChangeActive = async () => {
		try {
			const sendData = { name : row.name, isActive : !row.isActive};
			await send('/change/active/profile', sendData);
			state.changeActive(sendData)

		} catch (e) {
			state.showError(e.message || e);
		}
	};

	const handleEdit = () => {
		const {
			name,
			files,
			dirSave,
			isUploadToOwnCloud
		} = row;

		state.edit({name, files, dirSave, isUploadToOwnCloud});

		history.push(PATH_PROFILE_EDIT);
	};

	const handleDelete = async () => {
		if (!window.confirm(`You real want delete ${row.name} profile`) ) {
			return false;
		}

		try {
			await send('/delete/profile', { name : row.name });
			state.delete(row.name);
		} catch (e) {
			state.showError(e.message || e);
		}
	};

	const handleCreateArchive = async () => {
		state.archCreate(row.name);
		history.push(PATH_ARCH_NEW);
	};

	let btnChangeActive, btnCreateArchive;

	if (row.isActive) {
		btnChangeActive = <IconButton aria-label="Change active" key={row.name + '_change_active'}
		                              onClick={() => handleChangeActive()} color={'secondary'} >
			<IconOff key={row.name + '_ico_active_off'} />
		</IconButton>;

		btnCreateArchive  = <Tooltip title="Create archive" key={row.name + '_tl_archive'}>
			<IconButton aria-label="Change active" key={row.name + '_create_archive'}
			            onClick={() => handleCreateArchive()} color={'primary'} >
				<IconArchive key={row.name + '_ico_archive'} />
			</IconButton>
		</Tooltip>;
	} else {
		btnCreateArchive  = null;
		btnChangeActive = <IconButton aria-label="Change active" key={row.name + '_change_active'}
		                              onClick={() => handleChangeActive()} color={'primary'} >
			<IconOn key={row.name + '_ico_active_on'} />
		</IconButton>;
	}

	return (
		<TableRow
			hover
			tabIndex={-1}
			key={row.name}
		>
			<TableCell>
				{
					isLoad && loadRow === row.name
						? <LoadAnimation/>
						: [
							(
								<Tooltip title="Delete"  key={row.name + '_tl_delete'} color={'secondary'}>
									<IconButton aria-label="Delete" onClick={handleDelete}  key={row.id + '_delete'}>
										<DeleteIcon key={row.name + '_ico_delete'}/>
									</IconButton>
								</Tooltip>
							),
							(
								<Tooltip title="Edit" key={row.name + '_tl_edit'} color={'primary'}>
									<IconButton aria-label="Edit" onClick={handleEdit} key={row.id + '_edit'}>
										<EditIcon key={row.name + '_ico_edit'}/>
									</IconButton>
								</Tooltip >
							),
							(
								<Tooltip title="Change active" key={row.name + '_tl_active'}>
									{btnChangeActive}
								</Tooltip>
							),
							btnCreateArchive
						]
				}
			</TableCell>
			<TableCell component="th" scope="row" padding="none" >
				{row.name}
			</TableCell>
		</TableRow>
	);
};

export default connect(
	state => ({
		store : state.Settings,
	}),
	dispatch => ({
		archCreate   : (data) => dispatch({type : `${ARCH_NEW}_USE_PROFILE`, data}),
		edit         : (data) => dispatch({type : `${PROFILE}_EDIT`, data}),
		delete       : (data) => dispatch({type : `${PREFIX}_PROFILE_DELETE`, data}),
		changeActive : (data) => dispatch({type : `${PREFIX}_PROFILE_CHANGE_ACTIVE`, data}),
		showError    : message => dispatch({
			type : `${ALERT}_OPEN`,
			data : {
				message,
				showIcon : ICON_TYPES.BAD,
				type : TYPES.BAD
			}
		})
	})
)(withStyles(theme => ({}))(RowShow))
