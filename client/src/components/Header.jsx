import React, { useState , useEffect} from 'react'
import { FooterBrand } from 'flowbite-react'
import {FaSearch} from 'react-icons/fa'
import {FcMenu} from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
/* breaks at 884px */

export default function Header() {
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm,setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-gray-300 shadow-sm ty:fixed df:sticky'>

      <div className='flex justify-between max-w-6xl items-center  m-auto p-3'>
        <Link to='/' className='flex -ml-10 flex-row justify-between'>
          <FooterBrand
                      href="/"
                      src="../favicon.ico"
                      alt="Dr estate Logo"
          />
          <h1 className='font-bold text-2xl sm:text-3xl flex font-serif'>

            <span className='text-slate-500'>Dr</span>
            <span>.</span>
            <span className='text-red-500'>Estate</span>

          </h1>
        </Link>
        
        <div className='flex justify-around'>
          <Link to='/buy'><div className='p-4 py-6 ty:hidden mdl:inline font-serif hover:border-t-4 hover:border-b-4 hover:border-b-black hover:border-t-gray-300 cursor-pointer'>Buy</div></Link>
          <Link to='/sell'><div className='p-4 py-6 ty:hidden  mdl:inline font-serif hover:border-t-4 hover:border-b-4 hover:border-b-black hover:border-t-gray-300 cursor-pointer'>Sell</div></Link>
          <Link to='/rent'><div className='p-4 py-6 ty:hidden mdl:inline font-serif hover:border-y-4 hover:border-b-4 hover:border-b-black hover:border-t-gray-300 cursor-pointer'>Rent</div></Link>
        </div>

        <form onSubmit={handleSubmit} className='bg-slate-200 flex items-center p-3 rounded-full border font-serif border-amber-100 hover:shadow-lg hover:border-blue-400'>

          <input className='bg-transparent font-serif placeholder-slate-500 focus:outline-none ty:w-32 df:w-36 ds:w-44 smd0:w-56 smd:w-64 mdl:w-80' autoComplete='off'
           type='text' 
           name='searchbar'
           id='searchbar'
           placeholder='Address, City, Zip Code or Neighborhood....'
           value={searchTerm}
           onChange={(e)=>setSearchTerm(e.target.value)}/>

          <button type='submit' name='search' id='search'>
            <FaSearch className='text-black/80 flex cursor-pointer'/>
          </button>

        </form>

        <div className='flex items-center justify-center'>
          <button name='menu' id='menu'>
            <FcMenu size={32} className='ty:inline md:hidden cursor-pointer'/>
          </button>
          <Link to='/'><div className='p-3 py-6 font-serif ty:hidden md:inline hover:border-y-4 hover:border-b-4 hover:border-b-black hover:border-t-gray-300 cursor-pointer'>Home</div></Link>
          
            {currentUser ? 
            (<Link to='/profile'>
              <img className='ml-2 font-serif rounded-full h-9 w-9 object-cover' src={currentUser.profilePic} alt='Profilehttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8Gl9eN3We2TcCYbPyAxqG6SqN02Wey-1vB0iuhZfyw&s'/>
            </Link>) 
            : 
            (<>
              <Link to='/sign-in'><div className='p-3 py-6 font-serif ty:hidden md:inline hover:border-y-4 hover:border-b-4 hover:border-b-black hover:border-t-gray-300 cursor-pointer'>Login</div></Link>
              <Link to='/sign-up'><div className='p-3 ml-1 font-serif ty:hidden md:inline pb-3 bg-black text-white px-4 py-2 rounded-3xl hover:bg-slate-700 cursor-pointer'>Sign-up</div></Link>
            </>)
            }
        </div>
      </div>
    </header>
  )
}
