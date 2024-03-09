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

export default function App() {

  return (
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/sign-in' element={<Signin />} />
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile />} />
      </Route>
      <Route path='/about' element={<About />} />
    </Routes>
  </Router>
  )
}