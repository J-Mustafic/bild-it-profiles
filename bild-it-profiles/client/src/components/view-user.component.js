import React, { Component } from 'react';
import Exercise from './exercise.component';
import Alert from 'react-s-alert';
import { Link } from 'react-router-dom';

import { formatDate } from '../utils/date-formatter';

import "react-datepicker/dist/react-datepicker.css";

import AuthService from '../utils/auth-utils/auth-service';

export default class ViewUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.user
        }

        this.Auth = new AuthService();
        this.deleteExercise = this.deleteExercise.bind(this);
    }

    componentDidMount() {
        this.Auth.fetch(`/users/${this.props.match.params.id}`, {
            method: 'GET'
        })
            .then(res => {
                if (res.status === 200)
                    this.setState({
                        user: res.data
                    })
            })
            .catch((error) => {
                console.log(error);
            })

    }

    deleteExercise(id) {
        this.Auth.fetch(`/exercises/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.status === 200)
                    Alert.success('Exercise successfully deleted.');
            });

        const exercises = this.state.user.exercises.filter(el => el._id !== id)
        const user = this.state.user;
        user.exercises = exercises;
        this.setState({
            user: user
        })
    }

    exerciseList() {
        if (this.state.user)
            return this.state.user.exercises ? this.state.user.exercises.map(currentexercise => {
                return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
            }) : '';
    }

    render() {
        return (
            <div>
                <h3>User Page</h3>
                <hr />
                <h4>{this.state.user ? this.state.user.fullName : ''}</h4>
                <h4>{this.state.user ? this.state.user.email : ''}</h4>
                <h4>{this.state.user ? formatDate(this.state.user.dob) : ''}</h4>
                <hr />
                <div>
                    <h3 className="d-inline-block mr-0">Logged Exercises</h3>
                    <Link to="/create" className="btn btn-primary mb-1 d-inline-block float-right">Create Exercise Log</Link>
                </div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exerciseList() || <tr><td>No entries.</td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }
}