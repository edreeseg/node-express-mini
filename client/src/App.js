import React, { Component } from 'react';
import axios from 'axios';
import UsersList from './components/UsersList';
import './App.css';

class App extends Component {
  state = {
    users: [],
  };
  componentDidMount(){
    axios('http://localhost:5000/api/users')
      .then(res => this.setState({ users: res.data.users }))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="app">
        <UsersList users={this.state.users} />
      </div>
    );
  }
}

export default App;
