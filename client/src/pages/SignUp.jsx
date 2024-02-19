import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import Header from '../components/Header'
import '../App.css'

export default function SignUp() {

  
  const [email,setEmail] = useState(null);
  const [username,setUsername] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:""
  })
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFormData({
      ...formData,
      [name] : value
    })
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleConfirmPasswordBlur = () => {
    if (formData.password !== confirmPassword) {
      setConfirmPasswordMessage('Passwords do not match');
    } else {
      setConfirmPasswordMessage(null);
    }
  };

  const handleSubmit = async(e) => {
    setError(null);
    setUsername(null);
    setEmail(null);
    setConfirmPasswordMessage(null);
    e.preventDefault();

    setLoading(true);

    if (formData.password !== confirmPassword){
      setConfirmPasswordMessage('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {   
      console.log("calling fetch");
      const res = await fetch("./api/auth/sign-up", {  // function is used to send an asynchronous HTTP request to the server's signup API endpoint ("./api/auth/sign-up")
        method: "POST", // Adjust the HTTP method based on your API endpoint requirements
        headers: {
          "Content-Type": "application/json",  //format of the request body
      },
      body: JSON.stringify(formData), // Convert FormData to JSON
    });
    console.log("called fetch");

    await delay(1000);
    
    const data = await res.json();  //get json response in data

    // console.log(data);

    if (data.success === false) {
      if (data.message.includes('Email already exists')) {  // Handle duplicate email error
        setEmail(data.message);
        setUsername(null);
        setError(null);
        setConfirmPasswordMessage(null);
      }
      else if(data.message.includes('Username already exists')){  // Handle duplicate username error
        setUsername(data.message);
        setEmail(null);
        setError(null);
        setConfirmPasswordMessage(null);
      }
      else{
        setError(null);
        setEmail(null);
        setUsername(null);
      }
      setLoading(false);
      return;

    }else {
        setError("sign-up successful");
        setEmail(null);
        setUsername(null);
        setLoading(false);
        setConfirmPasswordMessage(null);
        await delay(1000);
        navigate('/sign-in');
        return;
      }
    } catch (error) {
      setLoading(false);
      setEmail(null);
      setUsername(null);
      setConfirmPasswordMessage(null);
      setError(error.message);
    }
  }

  return (
    <div className='ty:fixed df:static'>
      <div className='blur-sm'>
        <Header/>
      </div>

      <div className='flex items-center justify-center backdrop-blur-sm'>
        <div className="w-full max-w-md h-screen -mt-10 p-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Welcome to Dr.Estate</h1>
          
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className="mb-4 cursor-pointer">
              <label htmlFor="username" className="text-gray-800 block mb-2 cursor-pointer"  onChange={handleChange}>Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" value={formData.username}
                      className="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" onChange={handleChange} required/>
              <p className='m-3 text-red-600 text-sm'>{username}</p>
            </div>
            <div className="mb-4 cursor-pointer">
              <label htmlFor="email" className="text-gray-800 block mb-2 cursor-pointer" >Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" autoComplete='on' value={formData.email}
                      className="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" onChange={handleChange} required/>
              <p className='m-3 text-red-600 text-sm'>{email}</p>
            </div>
            <div className="mb-4 cursor-pointer">
              <label htmlFor="password" className="text-gray-800 block mb-2 cursor-pointer" >Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password}
                      className="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" onChange={handleChange} required/>
            </div>
            <div className="mb-4 cursor-pointer">
              <label htmlFor="cpassword" className="text-gray-800 block mb-2 cursor-pointer" >Confirm Password</label>
              <input type="password" id="cpassword" name="cpassword" placeholder="Confirm your password" value={confirmPassword}
                      className="w-full px-4 py-2 border rounded 
                            focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                          hover:border-blue-500" onChange={handleConfirmPasswordChange} onBlur={handleConfirmPasswordBlur} required/>
              <p className='m-3 text-red-600 text-sm'>{confirmPasswordMessage}</p>
            </div>
            <button disabled={loading} type="submit" id="sign-up" name="sign-up" className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">
              {loading ? 'loading...' : 'Sign Up'}
            </button>
          </form>
          <p className='m-3 text-red-600 text-sm'>{error}</p>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Already have an account? <Link to='/sign-in'><span className='text-blue-500'>Log in</span></Link>
          </p>

          <div className='flex flex- items-center justify-evenly m-3'>
            <div className='MyDivider'></div>
            <div className='text-center text-lg px-3 pb-2 pt-1'>or</div>
            <div className='MyDivider'></div>
          </div>
    
          <button className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4">
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
