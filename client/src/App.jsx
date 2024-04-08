import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Signin from './pages/Signin';
import Profile from './pages/Profile';
import Sell from './pages/Sell';
import AgentDashboard from './pages/AgentDashboard';
import PrivateRoute2 from './components/PrivateRoute2';
import PrivateRoute3 from './components/PrivateRoute3';
import AgentProfile from './pages/AgentProfile';
import UserProperty from './pages/UserProperty';
import NewLeads from './pages/NewLeads';
import RecentLeads from './pages/RecentLeads';
import AgentTotalProp from './pages/AgentTotalProp';
import Buy from './pages/Buy';
import RecentBuyLead from './pages/RecentBuyLead';
import NewBuyLead from './pages/NewBuyLead';
import Header from './components/Header';
import AgentHeader from './components/AgentHeader';
import Search1 from './pages/Search1';
import PrivateRoute1 from './components/PrivateRoute1';

export default function App() {

  const { role} = useSelector((state) => state.user);
  return (
  <Router>
    {role==='agent' ?(<AgentHeader/>):(<Header/>)}
    <Routes>
      
      <Route element={role === 'agent' ? <AgentDashboard /> : <PrivateRoute3 from="home"/>}>
        <Route path='/' element={<Home/>} />
      </Route>
      <Route path='/search' element={<Search1/>} />
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
      <Route element={<PrivateRoute2 from="agent-leads"/>}>
        <Route path='/new-leads' element={<NewLeads/>}/>
      </Route>
      <Route element={<PrivateRoute2 from="agent-leads"/>}>
        <Route path='/recent-leads' element={<RecentLeads/>}/>
      </Route>
      <Route element={<PrivateRoute2 from="agent-leads"/>}>
        <Route path='/new-buy-leads' element={<NewBuyLead/>}/>
      </Route>
      <Route element={<PrivateRoute2 from="agent-leads"/>}>
        <Route path='/recent-buy-leads' element={<RecentBuyLead/>}/>
      </Route>
      <Route element={<PrivateRoute2 from="agent-properties"/>}>
        <Route path='/properties' element={<AgentTotalProp/>}/>
      </Route>

      <Route element={<PrivateRoute1 from="profile"/>}>
        <Route path='/profile' element={<Profile/>} />
      </Route>

      <Route element={<PrivateRoute1 from="user-property"/>}>
        <Route path='/your-property' element={<UserProperty/>}/>
      </Route>

      <Route element={<PrivateRoute1 from="sell"/>}>
        <Route path='/sell' element={<Sell />}/>
      </Route>
      <Route element={<PrivateRoute1 from="buy"/>}>
        <Route path='/buy' element={<Buy/>}/>
      </Route>
      <Route element={<PrivateRoute1 from="rent"/>}>
        <Route path='/rent' element={<Sell />}/>
      </Route>
    </Routes>
  </Router>
  )
}