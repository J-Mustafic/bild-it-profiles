import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import io from 'socket.io-client';
import AuthService from './utils/auth-service';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import Navbar from "./components/navbar-ui.component"
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import RegisterUser from "./components/register-user.component";
import ViewUser from './components/view-user.component';
import ViewUsers from './components/view-users.component';
import Login from './components/login-user.component';
import PrivateRoute from './components/private-route.component';
import Alert from 'react-s-alert';
const HOST = window.location.origin;

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      loggedIn: false,
      notifications: []
    }

    this.Auth = new AuthService();
    this.socket = io(HOST);
    this.loggedIn = this.loggedIn.bind(this);
    this.logout = this.logout.bind(this);
    this.receiveNotification = this.receiveNotification.bind(this);
    this.updateNotifications = this.updateNotifications.bind(this);
    this.socket.on('RECIEVE_NOTIFICATION', this.receiveNotification);
    this.socket.on('UPDATE_NOTIFICATIONS', this.updateNotifications);
  }

  receiveNotification(data) {
    this.state.notifications.unshift(data);
    this.setState({
      notifications: this.state.notifications
    });
  }

  updateNotifications(data) {
    this.setState({
      notifications: data
    });
  }

  componentDidMount() {
    if (this.Auth.loggedIn()) {
      this.setState({
        user: this.Auth.getProfile(),
        loggedIn: true
      });
      this.registerSocket(this.Auth.getProfile());
    }
  }

  registerSocket(user) {
    this.socket.emit('REGISTER_SOCKET', user);
  }

  loggedIn(state) {
    this.setState({
      user: state.user,
      loggedIn: state.loggedIn
    });
  }

  logout(e) {
    e.preventDefault();
    this.Auth.logout();
    this.setState({
      user: null,
      loggedIn: false
    });
    Alert.success('Logged out successfully.');
  }

  render() {
    return (
      <Router>
        <div className="container-flex" >
          {this.state.loggedIn && <Navbar notifications={this.state.notifications} user={this.state.user} logout={this.logout} />}
          <div className="container-fluid mt-5 pt-5">
            <Switch>
              <Route exact path='/' render={(props) => <Login {...props} loggedIn={this.loggedIn} />} />
              <PrivateRoute exact socket={this.socket} path="/home" user={this.state.user} loggedIn={this.state.loggedIn} component={ExercisesList} />
              <PrivateRoute exact path="/edit/:id" user={this.state.user} loggedIn={this.state.loggedIn} component={EditExercise} />
              <PrivateRoute exact path="/create" user={this.state.user} loggedIn={this.state.loggedIn} component={CreateExercise} />
              <PrivateRoute exact path="/user/register" user={this.state.user} loggedIn={this.state.loggedIn} component={RegisterUser} />
              <PrivateRoute exact path="/user/:id" user={this.state.user} loggedIn={this.state.loggedIn} component={ViewUser} />
              <PrivateRoute exact path="/all-users" user={this.state.user} loggedIn={this.state.loggedIn} component={ViewUsers} />
            </Switch>
            <Alert stack={{ limit: 3 }} offset={100} position="top-right" effect="slide" />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
