import React,{Component} from 'react';
import {  Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import './App.css';
import {
    PREFIX_UPDATE_LOCATION as UPDATE_LOCATION,
    PREFIX_SETTINGS,
} from "./const/prefix";

import {
    PATH_INDEX, PATH_PROFILE, PATH_PROFILE_NEW, PATH_PROFILE_EDIT,
    PATH_SETTINGS, PATH_ARCH_NEW,
} from "./const/path";

import {classes}      from './const/styles'
import MainMenu       from './componets/Layout/MainMenu'
import Header         from './componets/Layout/Header'
import Alert          from "./componets/Alert";
import {store}        from './configureStore';
import LoadAnimation  from './componets/LoadAnimation'
import {send}         from './tools/reqAstra'
import {alertOkEvent} from "./const/alert";
import {
    Settings,
    Profiles,
    ProfileNew,
    ProfileEdit,
    ArchiveCreate,
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

        store.dispatch({type : `${PREFIX_SETTINGS}_SET_APP_CONFIG`, data : response.data});

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
                    <Route path={PATH_INDEX} exact  component={Settings}/>
                    <Route path={PATH_SETTINGS}     component={Settings}/>
                    <Route path={PATH_PROFILE}      component={Profiles}/>
                    <Route path={PATH_PROFILE_NEW}  component={ProfileNew}/>
                    <Route path={PATH_PROFILE_EDIT} component={ProfileEdit}/>
                    <Route path={PATH_ARCH_NEW}     component={ArchiveCreate}/>
                    <Route path="*"                 component={Settings} />
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
