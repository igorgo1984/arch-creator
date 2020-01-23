import React from 'react'
import {connect} from 'react-redux'
import {
	PREFIX_ALERT       as ALERT,
	PREFIX_OWN_CLOUD   as PREFIX
} from "../../../const/prefix";

import {withStyles} from "@material-ui/core";
import TableRow     from "@material-ui/core/TableRow";
import TableCell    from "@material-ui/core/TableCell";
import Tooltip      from "@material-ui/core/Tooltip";

import IconButton  from "@material-ui/core/IconButton";

import IconDelete   from '@material-ui/icons/Delete';
import IconDir      from '@material-ui/icons/Folder';
import IconFile     from '@material-ui/icons/FileCopy';
import IconDownLoad from '@material-ui/icons/GetApp';

import {ICON_TYPES, TYPES} from "../../../const/alert";
import LoadAnimation       from '../../LoadAnimation';
import {send}              from "../../../tools/reqAstra";
import {showSaveDialog}    from "../../../tools/messageBox";


const RowShow = (state) => {
	const { row, store, changeField, showOk, } = state;
	const { isLoad } = store;

	const handleDelete = async () => {

		if (!window.confirm(`You real want delete ${row.name} profile`) ) {
			return false;
		}

		changeField('isLoad', true);

		try {
			await send('/own-cloud/file/move', { link : row.Link });
			state.delete(row.Link);
		} catch (e) {
			state.showError(e.message || e);
		} finally {
			changeField('isLoad', false);
		}
	};

	const handleDownload = async () => {
		try {
			changeField('isLoad', true);

			const pathSave = await showSaveDialog({
				title: 'System  archive creator',
				defaultPath:  `*/${row.name}`
			});

			await send('/own-cloud/file/download', {link: row.Link, pathSave});
			showOk(`Download file ${row.name} is success`)
		} catch (e) {
			state.showError(e.message || e);
		} finally {
			changeField('isLoad', false);
		}
	};

	return (
		<TableRow
			hover
			tabIndex={-1}
			key={row.Link}
		>
			<TableCell>
				{
					isLoad
						? <LoadAnimation/>
						: [
							(
								<Tooltip title="Delete"  key={row.Link + '_tl_delete'} color={'secondary'}>
									<IconButton aria-label="Delete" onClick={handleDelete}  key={row.Link + '_delete'}>
										<IconDelete key={row.Link + '_ico_delete'}/>
									</IconButton>
								</Tooltip>
							),
							(
								<Tooltip title="Download"  key={row.Link + '_tl_download'} color={'primary'}>
									<IconButton aria-label="Download" onClick={handleDownload}  key={row.Link + '_download'}>
										<IconDownLoad key={row.Link + '_ico_download'}/>
									</IconButton>
								</Tooltip>
							),
						]
				}
			</TableCell>
			<TableCell >
				{row.isDir
					? <Tooltip title="Is folder" key={row.Link + '_tl_file_type'}><IconDir /></Tooltip>
					: <Tooltip title="Is file" key={row.Link + '_tl_file_type'}><IconFile /></Tooltip>
				}
			</TableCell>
			<TableCell  >
				{row.name}
			</TableCell>
			<TableCell>{ row.Size || '---' }</TableCell>
			<TableCell>{ row.Modified }</TableCell>
			<TableCell>{ row.ContentType || '---' }</TableCell>
		</TableRow>
	);
};

export default connect(
	state => ({
		store : state.OwnCloud,
	}),
	dispatch => ({
		delete       : (data) => dispatch({type : `${PREFIX}_FILE_DELETE`, data}),
		changeField  : (field, value) => dispatch({type : `${PREFIX}_CHANGE_FIELD`, data : {field, value} }),
		showOk    : message => dispatch({
			type : `${ALERT}_OPEN`,
			data : {
				message,
				showIcon : ICON_TYPES.OK,
				type : TYPES.OK
			}
		}),
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
