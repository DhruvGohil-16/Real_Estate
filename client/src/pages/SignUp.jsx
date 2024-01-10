import React from 'react'
import { Link } from "react-router-dom";
import Header from '../components/Header'


export default function SignUp() {
  return (
    <div>
      <div className='blur-sm'>
        <Header></Header>
      </div>

      <div className='flex items-center justify-center m-8 backdrop-blur-sm'>
        <div className="w-full max-w-md p-8 bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Welcome to Dr.Estate</h1>
          <form autoComplete='off'>
            <div className="mb-4 cursor-pointer">
              <label for="username" class="text-gray-800 block mb-2 cursor-pointer">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter username" 
                      class="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" required/>
            </div>
            <div className="mb-4 cursor-pointer">
              <label for="email" class="text-gray-800 block mb-2 cursor-pointer">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter email" autoComplete='on'
                      class="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" required/>
            </div>
            <div className="mb-4 cursor-pointer">
              <label for="password" class="text-gray-800 block mb-2 cursor-pointer">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter password" 
                      class="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" required/>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Already have an account? <Link to='/sign-in'><span className='text-blue-500'>Log in</span></Link>
          </p>
        </div>
      </div>
    </div>
  ) 
}
