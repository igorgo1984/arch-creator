import React from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from "@material-ui/core/AppBar/AppBar";

import {PREFIX_MENU as PREFIX} from "../../const/prefix";
import {withStyles} from "@material-ui/core";
import {classes} from '../../const/styles'

const Header = (state) => {

	const { classes, store } = state;
	const { isOpen } = store;

	// eslint-disable-next-line
	return (
		<AppBar
			position="absolute"
			className={classNames(classes.appBar, isOpen && classes.appBarShift)}
		>
			<Toolbar disableGutters={!isOpen}>
				<IconButton
					color="inherit"
					aria-label="Open drawer"
					onClick={state.open}
					className={classNames(classes.menuButton, isOpen && classes.hide)}
				>
					<MenuIcon />
				</IconButton>
					Power by<a
					href="https://drive.google.com/file/d/1tm6j8uGoeEbaVDYKlsQlkkxAD5WMXp3-/view?usp=sharing"
					style={{color:"red", marginLeft: 3}}
					target="_blank  "
				>Igor Stcherbina</a>
			</Toolbar>
		</AppBar>
	);
};

export default connect(
	state => ({
		store : state.Menu,
	}),
	dispatch => ({
		open  : () => dispatch({type :`${PREFIX}_OPEN`})
	})
)(withStyles(classes, { withTheme: true })(Header))
