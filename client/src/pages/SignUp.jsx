import React, { useEffect, useState } from 'react'
import { Link, useNavigate} from "react-router-dom"
import {useToast, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Header from '../components/Header'
import '../App.css'
import GoogAuth from '../components/GoogAuth'
import MyFooter from '../components/MyFooter'

export default function SignUp() {

  const [email,setEmail] = useState(null);
  const [username,setUsername] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState(null);
  const [agemail,setAgEmail] = useState(null);
  const [agconfirmPassword, setAgConfirmPassword] = useState("");
  const [agconfirmPasswordMessage, setAgConfirmPasswordMessage] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:"",
    role:"user"
  });
  const [agentFormData, setAgentFormData] = useState({
    agname:"",
    agpassword:"",
    agemail:"",
    role:"agent",
    country:"",
    state:"",
    city:"",
  });

  const stateOptions = {
    India: ['Gujarat', 'Maharashtra', 'Delhi'],
    USA: ['New York', 'California', 'Texas'],
    // Add more countries and their respective states here
  };

  const cityOptions = {
      Gujarat: ['Surat', 'Ahmedabad', 'Vadodara'],
      Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
      Delhi: ['New Delhi', 'Gurgaon', 'Noida'],
      // Add more states and their respective cities here
  };
  const toast = useToast();

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleChange = (e) => {
    setAgentFormData({
      agname:"",
      agpassword:"",
      agemail:"",
      role:"agent",
      country:"",
      state:"",
      city:"",
    });
    const { name, type, value } = e.target;
    setFormData({
      ...formData,
      [name] : value
    })
  };

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

  const handleAgentChange = (e) => {
    setFormData({
      username:"",
      password:"",
      email:"",
      role:"user"
    });
    const { name, type, value } = e.target;
    setAgentFormData({
      ...agentFormData,
      [name] : value
    });
    console.log(agentFormData);
  }

  const handleLocationChange = (e) => {
    setFormData({
      username:"",
      password:"",
      email:"",
      role:"user"
    });
    const {  name, value, type, checked } = e.target;
          
    if (name === "country") {
        setAgentFormData({ ...agentFormData, country: value, state: "", city: "" });
    } else if (name === "state") {
        if(value !== '')
        setAgentFormData({ ...agentFormData, state: value} );
        else
        setAgentFormData({ ...agentFormData, state: "State"});
    } else if(name === "city"){
        if(value !== '')
            setAgentFormData({ ...agentFormData, city: value});
        else
        setAgentFormData({ ...agentFormData, city: "City"});
    } else{
        setAgentFormData({
            ...agentFormData,
            [name]:value
        })
    }
  };

  const handleAgentConfirmPasswordChange = (event) => {
    setAgConfirmPassword(event.target.value);
  };

  const handleAgentConfirmPasswordBlur = () => {
    if (agentFormData.agpassword !== agconfirmPassword) {
      setAgConfirmPasswordMessage('Passwords do not match');
    } else {
      setAgConfirmPasswordMessage(null);
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
        toast({
          title: 'Account created',
          description: "Your account created successfully.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      setLoading(false);
      setEmail(null);
      setUsername(null);
      setConfirmPasswordMessage(null);
      setError(error.message);
    }
  };

  const handleAgentSubmit = async(e) => {
    setError(null);
    setAgEmail(null);
    setAgConfirmPasswordMessage(null);
    e.preventDefault();

    setLoading(true);

    if (agentFormData.agpassword !== agconfirmPassword){
      setAgConfirmPasswordMessage('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {   
      console.log("calling fetch");
      const res = await fetch("./api/auth/sign-up-agent", {  // function is used to send an asynchronous HTTP request to the server's signup API endpoint ("./api/auth/sign-up-agent")
        method: "POST", // Adjust the HTTP method based on your API endpoint requirements
        headers: {
          "Content-Type": "application/json",  //format of the request body
      },
      body: JSON.stringify(agentFormData), // Convert FormData to JSON
    });
    console.log("called fetch");
    
    const data = await res.json();  //get json response in data

    console.log(data);

    if (data.success === false) {
      if (data.message.includes('Email already exists')) {  // Handle duplicate email error
        setAgEmail(data.message);
        setError(null);
        setAgConfirmPasswordMessage(null);
      }
      else{
        setError(null);
        setAgEmail(null);
      }
      setLoading(false);
      return;

    }else {
        setError("sign-up successful");
        setAgEmail(null);
        setLoading(false);
        setAgConfirmPasswordMessage(null);

        await delay(1000);

        navigate('/sign-in');
        toast({
          title: 'Account created',
          description: "Your account created successfully. Email containing id has been sent to you...",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setAgEmail(null);
      setAgConfirmPasswordMessage(null);
      setError(error.message);
    }
  };

  return (
    <div className='ty:fixed df:static'>
      <div>
        <Header/>
      </div>

      <div className='flex min-h-auto items-center justify-center bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent '>
        <div className="w-full max-w-md m-10 mb-20 p-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Welcome to Dr.Estate</h1>
          <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
              <Tab>User</Tab>
              <Tab>Agent</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <>
                  <form autoComplete='off' onSubmit={handleSubmit}>
                    <div className="mb-4 cursor-pointer">
                      <label htmlFor="name" className="text-gray-800 block mb-2 cursor-pointer">Username</label>
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
            
                  <GoogAuth/>

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
                </>
              </TabPanel>
              <TabPanel>
                <>
                  <form autoComplete='off' onSubmit={handleAgentSubmit}>
                    <div className="mb-4 cursor-pointer">
                      <label htmlFor="agname" className="text-gray-800 block mb-2 cursor-pointer">Full name</label>
                      <input type="text" id="agname" name="agname" placeholder="Enter your full name" value={agentFormData.agname}
                              className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500" onChange={handleAgentChange} required/>
                    </div>
                    <div className="mb-4 cursor-pointer">
                      <label htmlFor="agemail" className="text-gray-800 block mb-2 cursor-pointer" >Email</label>
                      <input type="email" id="agemail" name="agemail" placeholder="Enter your professional email address" autoComplete='on'  value={agentFormData.agemail}
                              className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500" onChange={handleAgentChange} required/>
                      <p className='m-3 text-red-600 text-sm'>{agemail}</p>
                    </div>

                    <label className='block text-sm font-semibold text-gray-800 mb-3 mt-5'>( Which country, state & city do you work in ? )</label>
                    <div className='grid grid-cols-3 gap-2'>
                      <div className="mb-4">
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                          <select id="country" name="country" required value={agentFormData.country}  onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option value="Country">--Select Country--</option>
                              <option value="India">India</option>
                              <option value="USA">USA</option>
                          </select>
                      </div>

                      <div className="mb-4">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                          <select id="state" name="state" required defaultChecked="default" onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option key="default" value="">--Select State--</option>
                          {stateOptions[agentFormData.country]?.map(state => (
                              <option key={state} value={state}>{state}</option>
                          ))}
                          </select>
                      </div>

                      <div className="mb-4">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                          <select id="city" name="city" required defaultChecked='default' onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option key='deafult' value="">--Select City--</option>
                          {cityOptions[agentFormData.state]?.map(city => (
                              <option key={city} value={city}>{city}</option>
                          ))}
                          </select>
                      </div>
                    </div>
                    <div className="mb-4 cursor-pointer">
                      <label htmlFor="agpassword" className="text-gray-800 block mb-2 cursor-pointer" >Password</label>
                      <input type="password" id="agpassword" name="agpassword" placeholder="Enter your password" value={agentFormData.agpassword}
                              className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500" onChange={handleAgentChange} required/>
                    </div>
                    <div className="mb-4 cursor-pointer">
                      <label htmlFor="agcpassword" className="text-gray-800 block mb-2 cursor-pointer" >Confirm Password</label>
                      <input type="password" id="agcpassword" name="agcpassword" placeholder="Confirm your password" value={agconfirmPassword}
                              className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500" onChange={handleAgentConfirmPasswordChange} onBlur={handleAgentConfirmPasswordBlur} required/>
                      <p className='m-3 text-red-600 text-sm'>{agconfirmPasswordMessage}</p>
                    </div>

                    <button disabled={loading} type="submit" id="sign-up-agent" name="sign-up-agent" className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">
                      {loading ? 'loading...' : 'Sign Up'}
                    </button>
                  </form>
                  <p className='m-3 text-red-600 text-sm'>{error}</p>
                  <p className="mt-4 text-gray-600 text-sm text-center">
                    Already have an account? <Link to='/sign-in'><span className='text-blue-500'>Log in</span></Link>
                  </p>
                </>
              </TabPanel>
            </TabPanels>
          </Tabs>
          

        </div>
      </div>
      <MyFooter/>
    </div>
  ) 
}
