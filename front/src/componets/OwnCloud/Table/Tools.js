import React   from "react";
import connect from "react-redux/es/connect/connect";

import {withStyles} from "@material-ui/core";
import Typography   from "@material-ui/core/Typography/Typography";
import Toolbar      from "@material-ui/core/Toolbar/Toolbar";
import TextField    from "@material-ui/core/TextField";
import IconButton   from '@material-ui/core/IconButton';
import Tooltip      from '@material-ui/core/Tooltip';

import { lighten } from '@material-ui/core/styles/colorManipulator';
import AddBoxIcon  from '@material-ui/icons/AddBox';

import classNames  from 'classnames';

import {
	PREFIX_SETTINGS as PREFIX,
} from '../../../const/prefix'

const toolbarStyles = theme => ({
	root: { paddingRight:  theme.spacing(1), },
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	spacer: { flex: '1 1 60%', },
	actions: { color: theme.palette.text.secondary, },
	title: { flex: '0 0 auto', },
});

const TypographyVariant = 'h5';

const EnhancedTableToolbar = state => {
	const { classes } = state;

	const {
		selected,
		List: data,
		search
	} = state.store;

	const numData     = data.length;
	const numSelected = selected.length;

	return (
		<Toolbar
			className={classNames(classes.root, {[classes.highlight]: numSelected > 0,})}
		>
			<div className={classes.title}>
				{(<Typography variant={TypographyVariant} id="tableTitle">
					List
				</Typography>)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{
					numData
						? <TextField label={'Search'} value={search} onChange={state.changeSearch} />
						: null
				}
			</div>
		</Toolbar>
	);
};

export default connect(
	state => ({ store : state.OwnCloud }),
	dispatch => ({
		changeSearch : (ev) => dispatch({type : `${PREFIX}_CHANGE_SEARCH`, data: ev.target.value}),
	})
)(withStyles(toolbarStyles)(EnhancedTableToolbar))
