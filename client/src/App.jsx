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

export default function App() {

  return (
  <Router>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/sign-up' element={<SignUp/>} />
      <Route path='/sign-in' element={<Signin/>} />
      <Route element={<PrivateRoute from="sell"/>}>
        <Route path='/sell' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute from="buy"/>}>
        <Route path='/buy' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute from="rent"/>}>
        <Route path='/rent' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute from="profile"/>}>
        <Route path='/profile' element={<Profile/>} />
      </Route>
      <Route path='/about' element={<About/>} />
    </Routes>
  </Router>
  )
}