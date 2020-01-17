
import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {PREFIX_MENU as PREFIX} from "../../const/prefix";
import {withStyles} from "@material-ui/core";
import {classes} from "../../const/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import IconSettings  from '@material-ui/icons/Settings';
import IconDumps  from '@material-ui/icons/AllInbox';

import {
	PATH_INDEX,
	PATH_PROFILE,
} from '../../const/path';

import MenuMainItem from './MenuMainItem'

const MenuMain = (state) => {

	const { classes, theme, store } = state;
	const { isOpen } = store;

	return (
		<Drawer
			variant="permanent"
			classes={{
				paper: classNames(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
			}}
			open={isOpen}
		>
			<div className={classes.toolbar}>
				<IconButton onClick={state.close}>
					{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				</IconButton>
			</div>
			<Divider />
			<List>
				<MenuMainItem label={'Settings'} path={PATH_INDEX}>
					<IconSettings />
				</MenuMainItem>
				<MenuMainItem label={'Archive profile'} path={PATH_PROFILE}>
					<IconDumps />
				</MenuMainItem>
			</List>
		</Drawer>
	);
};

export default connect(
	state => ({
		store: state.Menu,
	}),
	dispatch => ({
		close : () => dispatch({type :`${PREFIX}_CLOSE`}),
		open  : () => dispatch({type :`${PREFIX}_OPEN`})
	})
)(withStyles(classes, { withTheme: true })(MenuMain))
