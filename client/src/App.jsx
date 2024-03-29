import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Signin from './pages/Signin';
import Profile from './pages/Profile';
import About from './pages/About';
import PrivateRoute from './components/privateRoute';
import Sell from './pages/Sell';
import AgentDashboard from './pages/AgentDashboard';
import PrivateRoute2 from './components/PrivateRoute2';
import PrivateRoute3 from './components/PrivateRoute3';
import AgentProfile from './pages/AgentProfile';
import UserProperty from './pages/UserProperty';

export default function App() {

  return (
  <Router>
    <Routes>

      <Route element={<PrivateRoute3 from="home"/>}>
        <Route path='/' element={<Home/>} />
      </Route>

      <Route element={<PrivateRoute3 from="sign-up"/>}>
        <Route path='/sign-up' element={<SignUp/>} />
      </Route>

      <Route element={<PrivateRoute3 from="sign-in"/>}>
        <Route path='/sign-in' element={<Signin/>} />
      </Route>

      <Route element={<PrivateRoute2 from="Agent-dashboard"/>}>
        <Route path='/agent-dashboard' element={<AgentDashboard/>}/>
      </Route>
      <Route element={<PrivateRoute2 from="Agent-profile"/>}>
        <Route path='/agent-profile' element={<AgentProfile/>}/>
      </Route>

      <Route element={<PrivateRoute from="profile"/>}>
        <Route path='/profile' element={<Profile/>} />
      </Route>

      <Route element={<PrivateRoute from="user-property"/>}>
        <Route path='/your-property' element={<UserProperty/>}/>
      </Route>

      <Route element={<PrivateRoute from="sell"/>}>
        <Route path='/sell' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute from="buy"/>}>
        <Route path='/buy' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute from="rent"/>}>
        <Route path='/rent' element={<Sell />}/>
      </Route>

      <Route path='/about' element={<About/>} />
    </Routes>
  </Router>
  )
}