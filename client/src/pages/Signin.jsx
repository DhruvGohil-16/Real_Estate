import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc"
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import '../App.css'

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFacebookLogin = async () => {
    try {
      await auth.signInWithPopup(facebookProvider);
    } catch (error) {
      console.error(error);
    }
  };
}

export default function Signin() {
  return (
    <div className='ty:fixed df:static'>
      <div className='blur-sm'>
        <Header/>
      </div>

      <div className='flex items-center justify-center backdrop-blur-sm'>
        <div className="w-full max-w-md p-8 -mt-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Welcome to Dr.Estate</h1>

          <form autoComplete='off'>
     
            <div className="mb-4 cursor-pointer">
              <label htmlFor="email" className="text-gray-800 block mb-2 cursor-pointer" >Email</label>
              <input type="email" id="email" name="email" placeholder="Enter email" autoComplete='on'
                      className="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" required/>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">
              Continue
            </button>

          </form>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Don't have an account? <Link to='/sign-up'><span className='text-blue-500'>Register</span></Link>
          </p>

          <div className='flex flex- items-center justify-evenly m-3'>
            <div className='MyDivider'></div>
            <div className='text-center text-lg px-3 pb-2 pt-1'>or</div>
            <div className='MyDivider'></div>
          </div>
    
          <button  className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4">
            <FcGoogle className='h-7 w-7'/>
            <div className='pb-1 w-4/5'>Continue with Google</div>
          </button>
          <button  className="flex justify-evenly w-full p-2 rounded  border border-black hover:bg-slate-300 mb-4">
          <svg  xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 "
            fill="currentColor"
            style={{ color: "#1877f2" }}
            viewBox="0 0 24 24"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
            <div className='pb-1 w-4/5'>Continue with Facebook</div>
          </button>
      
        </div>
      </div>
    </div>
  )
}