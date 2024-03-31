import React,{useEffect, useState} from 'react';
import { FooterBrand } from 'flowbite-react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';

export default function AgentHeader() {
  
    const { currentUser} = useSelector((state) => state.user);
    const [count,setCount] = useState(0);

    const fetchNewCount = async () => {
        setCount(0);
        try {
            const response = await fetch(`/api/agent/newCount/${currentUser._id}`);
            const Data = await response.json();
            
            if(Data.success===false){
                setCount(0);
                console.log(Data.message);
            }
            else
                setCount(Data.data);

        } catch (error) {
            setCount(0);
            console.log(error);
        }

    };

    useEffect(() => {
        fetchNewCount();
    },[]);

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
            <Link to="/new-leads" className="hover:text-blue-800 flex flex-row">
                New Leads
                {count !==0 && (
                    <div className='-mt-2 ml-1'>
                        <span className="relative inline-flex items-center justify-center h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-700 opacity-75"></span>
                            <span className="relative inline-flex items-center justify-center rounded-full h-full w-full bg-sky-500 text-center">{count}</span>
                        </span>
                    </div>
                )}
                {count ===0 && (
                    <div className='-mt-2 ml-1 h-5 w-5'/>
                )

                }
            </Link>
            <Link to="/recent-leads" className="hover:text-blue-800 flex flex-row">
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