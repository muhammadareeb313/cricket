// import logo from './logo.svg';
import './App.css';
import { baseUrl } from "./core"
import axios from 'axios';
import { useEffect,} from "react"

import {

  Switch,
  Route,

  useHistory,
  Redirect
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, Navbar, Container, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';



import Splash from "./components/splash/index"
import Login from "./components/login/index"
import Signup from "./components/signup/index"
import Admin from './components/admin/Admin';
import User from'./components/user/User';

import Profile from "./components/profile/index"

import { GlobalContext } from './context/Context';
import { useContext } from "react";





function App() {

  let history = useHistory();
  let { state, dispatch } = useContext(GlobalContext);

  const logout = () => {
    axios.post(`${baseUrl}/api/v1/logout`, {}, {
      withCredentials: true
    })
      .then((res) => {
        console.log("res +++: ", res.data);
  
        dispatch({
          type: "USER_LOGOUT"
        })
      })
  }

  useEffect(() => {

    axios.get(`${baseUrl}/api/v1/profile`, {
      withCredentials: true
    })
      .then((res) => {
        console.log("res: ", res.data);

        if (res.data.email) {

          dispatch({
            type: "USER_LOGIN",
            payload: {
              name: res.data.name,
              email: res.data.email,
              _id: res.data._id
            }
          })
        } else {
          dispatch({ type: "USER_LOGOUT" })
        }
      }).catch((e) => {
        dispatch({ type: "USER_LOGOUT" })
      })

    return () => {
    };
  }, []);


  return (
    <>

      



      {(state.user === undefined) ?
        <Switch>
          <Route exact path="/">
            <Splash />
          </Route>
          {/* <Redirect to="/" /> */}
        </Switch>
        : null}

      {(state.user === null) ?
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Redirect to="/" />
        </Switch> : null
      }

      {(state.user) ?
        <Switch>
          <Route exact path="/">
            <Admin />
          </Route>
          <Route exact path="/user">
            <User />
          </Route>
          <Redirect to="/" />
        </Switch>
        : null}

    </>
  );
}

export default App;