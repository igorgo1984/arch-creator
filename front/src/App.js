import React,{Component} from 'react';
import {  Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import './App.css';
import {
    PREFIX_UPDATE_LOCATION as UPDATE_LOCATION,
} from "./const/prefix";
import {
    PATH_INDEX,
    PATH_SETTINGS,
    PATH_DUMP_CREATE,
    PATH_DUMPS,
} from "./const/path";

import {
    PREFIX_SETTINGS
} from "./const/prefix";

import {classes} from './const/styles'
import MainMenu from './componets/Layout/MainMenu'
import Header from './componets/Layout/Header'
import Alert from "./componets/Alert";
import {store} from './configureStore';
import LoadAnimation from './componets/LoadAnimation'
import {send} from './tools/reqAstra'
import {alertOkEvent} from "./const/alert";
import {
    Settings,
} from './pages'

class App extends Component {
  constructor (props) {
      super(props);

      this.state = {
          isInit: false,
          errorMessage : ''
      };
  }
  waitAstilectronReady () {
      return new Promise((ok, bad) => {
          window.document.addEventListener('astilectron-ready', ok);
          setTimeout(() => bad(new Error('Wait astilectron-ready deadline')), 10e3)
      });
  }
  async componentWillMount() {
    this.props.updateLocation(this.props.location);

    try {
        await this.waitAstilectronReady();
        const response = await send('/app/init');
        // TODO: clear
        console.log('response ', response);
        // store.dispatch({type : `${PREFIX_SETTINGS}_SET_APP_CONFIG`, data : response.data});

    } catch (e) {
        const mess = e.message || e;

        this.setState({...this.state, errorMessage: mess });
        store.dispatch(alertOkEvent(mess));
    } finally {
        this.setState({...this.state, isInit : true})
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.updateLocation(nextProps.location);
  }

  render() {
    const { classes } = this.props;

    if (!this.state.isInit) {
        return (<LoadAnimation />)
    }
    if (this.state.errorMessage) {
        return (<h1 style={{color :'red'}}>{this.state.errorMessage}</h1>)
    }

    return (
        <div className={classes.root}>
            <Header/>
            <MainMenu/>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path={PATH_INDEX} exact component={Settings}/>
                    <Route path={PATH_SETTINGS}    component={Settings}/>
                    <Route path="*"                component={Settings} />
                </Switch>
                <Alert/>
            </main>
        </div>
    );
  }
}

export default withStyles(classes, { withTheme: true })(
    withRouter(
        connect(
            null,
            {updateLocation : location => ({type: UPDATE_LOCATION, location})}
        )(App)
    )
);
