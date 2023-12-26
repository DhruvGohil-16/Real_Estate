import React from 'react'
import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-300 shadow-sm ty:fixed df:static '>

      <div className='flex justify-between max-w-6xl items-center  m-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-2xl sm:text-3xl flex flex-wrap'>

            <span className='text-slate-500'>Dr</span>
            <span>.</span>
            <span className='text-red-500'>Estate</span>

          </h1>
        </Link>

        <form className='bg-slate-200 flex items-center p-3 rounded-md border border-amber-100 hover:shadow-lg hover:border-blue-400'>

          <input className='bg-transparent placeholder-slate-500 focus:outline-none w-48 sm:w-80'
           type='text' 
           placeholder='Address, City, Zip Code or Neighborhood....'/>

          <FaSearch className='text-slate-600 flex'/>

        </form>

        <ul className='flex gap-4 '>
          <Link to='/'><li className='ty:hidden df:hidden  sm:inline hover:border-b-4 hover:border-black cursor-pointer'>Home</li></Link>
          <Link to='/sign-in'><li className='ty:hidden df:hidden  sm:inline hover:border-b-4 hover:border-black cursor-pointer'>Login</li></Link>
          <Link to='/sign-up'><li className='ty:hidden df:hidden  sm:inline bg-black text-white px-4 py-2 rounded-3xl hover:bg-slate-600 cursor-pointer'>Sign up</li></Link>
        </ul>
      </div>
    </header>
  )
}
