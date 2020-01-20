
import React from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconAdd from '@material-ui/icons/PlaylistAdd';
import IconMove from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {showOpenDialog} from "../../tools/messageBox";
import {alertBadEvent} from "../../const/alert";

import {
	BG_COLOR_BLUE,
	COLOR_WHITE,
	BG_COLOR_WARNING,
	COLOR_GREEN,
} from '../../const/colors'
import {
	PREFIX_NEW_PROFILE as PREFIX
} from '../../const/prefix'

const marginRightIcon = 5;
const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	headingPanel : {
		backgroundColor: BG_COLOR_BLUE,
		color: COLOR_WHITE
	},
	heading: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightRegular,
	},
	iconOk : {
		marginRight : marginRightIcon,
		color: COLOR_GREEN,
	},
	iconWarn : {
		marginRight : marginRightIcon,
		color: BG_COLOR_WARNING
	},
	button: {
		margin: theme.spacing(1),
		marginRight : marginRightIcon,
	},
}));

const SaveFiles = (state) => {
	const classes = useStyles();
	const {store} = state;
	const {files} = store;

	let fileList = (
		<div>
			<Typography>No files</Typography>
		</div>
	);

	if (files.length) {
		fileList = <div>
			{files.map((p, inx) => (
				<p key={`path_` + p}>
					<Button key={`drop_` + p}
					        onClick={() => state.moveFile(p)}
					><IconMove/></Button>{p}
				</p>
			))}
		</div>
	}

	const handlerAddDir = async () => {
		try {
			const paths = await showOpenDialog({
				title: "Add dirs to archive",
				properties: ['openDirectory', 'multiSelections']
			});

			if (!paths.length) return false;

			state.addFiles(paths);

		} catch (e) {
			state.alert(alertBadEvent(e.message || e))
		}
	};

	const handlerAddFile = async () => {
		try {
			const paths = await showOpenDialog({
				title: "Add files to archive",
				properties: ['openFile', 'multiSelections']
			});

			if (!paths.length) return false;

			state.addFiles(paths);

		} catch (e) {
			state.alert(alertBadEvent(e.message || e))
		}
	};

	return (
		<ExpansionPanel defaultExpanded={true}>
			<ExpansionPanelSummary
				className={classes.headingPanel}
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel2a-content"
				id="panel2a-header"
			>
				<Typography className={classes.heading}>Adding dir & files to archive.</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<div style={{ width: '100%' }}>
					<Box display="flex" flexDirection="row">
						<Button variant="contained" color="primary" size="small"
							className={classes.button}
							onClick={handlerAddFile}
						>
							<IconAdd /> Adding files
						</Button>
						<Button variant="contained" color="primary" size="small"
							className={classes.button}
							onClick={handlerAddDir}
						>
							<IconAdd /> Adding folders
						</Button>
					</Box>
					<br/>
					<Box display="flex" flexDirection="row">
						{fileList}
					</Box>
				</div>

			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};

export default connect(
	state => ({
		store: state.ProfileNew,
	}),
	dispatch => ({
		moveFile : (data) => dispatch({type : `${PREFIX}_MOVE_FILE_FROM_LIST`, data}),
		addFiles : (data) => dispatch({type : `${PREFIX}_ADD_FILES_TO_ARCH`, data}),
		alert    : (data) => dispatch(data)
	})
)(SaveFiles);
