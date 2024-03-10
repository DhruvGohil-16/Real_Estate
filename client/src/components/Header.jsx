import React from 'react'
import {FaSearch} from 'react-icons/fa'
import {FcMenu} from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
/* breaks at 884px */

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className='bg-gray-400 shadow-sm ty:fixed df:sticky'>

      <div className='flex justify-around max-w-6xl items-center  m-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-2xl sm:text-3xl flex flex-wrap'>

            <span className='text-slate-500'>Dr</span>
            <span>.</span>
            <span className='text-red-500'>Estate</span>

          </h1>
        </Link>
        
        <div className='flex'>
          <Link to='/'><div className='p-4 py-6 ty:hidden  mdl:inline hover:border-t-4 hover:border-b-2 hover:border-b-black hover:bg-gray-400/60 hover:border-t-gray-400/60 cursor-pointer'>Sell</div></Link>
          <Link to='/sign-in'><div className='p-4 py-6 ty:hidden mdl:inline hover:border-t-4 hover:border-b-2 hover:border-b-black hover:bg-gray-400/60 hover:border-t-gray-400/60 cursor-pointer'>Buy</div></Link>
          <Link to='/sign-up'><div className='p-4 py-6 ty:hidden mdl:inline hover:border-y-4 hover:border-b-2 hover:border-b-black hover:bg-gray-400/60 hover:border-t-gray-400/60 cursor-pointer'>Rent</div></Link>
        </div>

        <form className='bg-slate-200 flex items-center p-3 rounded-md border border-amber-100 hover:shadow-lg hover:border-blue-400'>

          <input className='bg-transparent placeholder-slate-500 focus:outline-none ty:w-32 df:w-36 ds:w-44 smd0:w-56 smd:w-64 mdl:w-80' autoComplete='off'
           type='text' 
           name='searchbar'
           id='searchbar'
           placeholder='Address, City, Zip Code or Neighborhood....'/>

          <button name='search' id='search'>
            <FaSearch className='text-black/80 flex cursor-pointer'/>
            </button>

        </form>

        <div className='flex items-center justify-center'>
          <button name='menu' id='menu'>
            <FcMenu size={32} className='ty:inline md:hidden cursor-pointer'/>
          </button>
          <Link to='/'><div className='p-3 py-6 ty:hidden md:inline hover:border-y-4 hover:border-b-2 hover:border-b-black hover:bg-gray-400/60 hover:border-t-gray-400/60 cursor-pointer'>Home</div></Link>
          
            {currentUser ? 
            (<Link to='/profile'>
              <img className='ml-2 rounded-full h-9 w-9 object-cover' src={currentUser.profilePic} alt='Profilehttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8Gl9eN3We2TcCYbPyAxqG6SqN02Wey-1vB0iuhZfyw&s'/>
            </Link>) 
            : 
            (<>
              <Link to='/sign-in'><div className='p-3 py-6 ty:hidden md:inline hover:border-y-4 hover:border-b-2 hover:border-b-black hover:bg-gray-400/60 hover:border-t-gray-400/60 cursor-pointer'>Login</div></Link>
              <Link to='/sign-up'><div className='p-3 ml-1 ty:hidden md:inline pb-3 bg-black text-white px-4 py-2 rounded-3xl hover:bg-slate-700 cursor-pointer'>Sign-up</div></Link>
            </>)
            }
        </div>
      </div>
    </header>
  )
}
