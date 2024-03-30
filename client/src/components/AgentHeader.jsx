import React from 'react';
import { FooterBrand } from 'flowbite-react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';

export default function AgentHeader() {
  
  const { currentUser} = useSelector((state) => state.user);
  
  return (
      <header className="bg-gray-200 py-4 ty:fixed df:sticky">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to='/agent-dashboard' className='flex flex-row justify-between'>
            <FooterBrand
                        href="/"
                        src="../favicon.ico"
                        alt="dr estate Logo"
            />
            <h1 className='font-bold text-2xl sm:text-3xl flex flex-wrap'>

              <span className='text-slate-500'>Dr</span>
              <span>.</span>
              <span className='text-red-500'>Estate</span>

            </h1>
          </Link>
          <div className="flex items-center space-x-4 ">
            <Link to="/new-leads" className="hover:text-blue-800">
              New Leads
            </Link>
            <Link to="/recent-leads" className="hover:text-blue-800">
              Recent Leads
            </Link>
            <Link to="/agent-profile" className="flex items-center space-x-2">
              <img src={currentUser.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
              <label className='hover:text-blue-800'><span><Link to='/agent-profile'>{currentUser.name}</Link></span></label>
            </Link>
          </div>
        </div>
      </header>
  )
};