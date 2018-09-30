import React, { Component } from 'react';
import { Route } from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';

// import components
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile';
import Layout from './components/Layout/Layout';




// function DummyComponent() {
//   return <h2>Hello World</h2>;
// }

// function DummyComponent1() {
//   return <h2>About - welcome to my app</h2>;
// }

// ProtectedRoute does not work


//<ProtectedRoute path='' component={} />



class App extends Component {

  componentDidMount = () => {
    //Fetch
    fetch('/about')
      .then((data) => data.json())
      .then(function (data) {
        console.log('Data: ', data);
      })

      .catch(() => {

      });


  };

  render() {
    return (
      <div className="App">
        {/* <Route exact path='/' component={DummyComponent} />
        <Route exact path='/about' component={DummyComponent1} /> */}
        {/* <Route exact path='/' component={DummyComponent} /> */}
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />
        <Route exact path='/profile' component={Profile} />
        <Route path='/community' component={Layout} />
        {/* <PrivateRoute path='/profile' component={Profile} /> */}

      </div>
    );
  }
}

export default App;
