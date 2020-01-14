import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePage/Home';
import Footer from './components/Footer/Footer';

import LoginContextProvider from './context/LoginContext';
import TransactionContextProvider from './context/TransactionContext';
import Login from './components/Start/Login';
import SignUp from './components/Start/SignUp';
import Report from './components/Report/Report'
import GuestContextProvider from './context/GuestContext';
import ErrorPage from './components/Loading_Error/ErrorPage';

const ProtectedRoute = ({ component: Component, ...props }) => {
  
    return (
      <Route 
        {...props} 
        render={props => (
          localStorage.getItem('expiry') && (parseInt(localStorage.getItem('expiry'))> Date.now()) ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )
}


function App() {
  return (
    <LoginContextProvider>
      <TransactionContextProvider>
        <GuestContextProvider>
          <Navbar />
          <Switch>
              <Route exact path="/" component={Login}/>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={SignUp}/>
              <Route path="/budget" component={Home}/>
              <ProtectedRoute path="/report" component={Report}/>
              <Route component={ErrorPage}/>
          </Switch>
          <Footer />
          </GuestContextProvider>
      </TransactionContextProvider>
    </LoginContextProvider>
  );
}

export default App;
