import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { defaultRed, signInFailure,signInStart,signInSuccess } from "../myredux/user/userSlice"; 
import Header from "../components/Header";
import "../App.css";
import GoogAuth from "../components/GoogAuth";
import MyFooter from "../components/MyFooter";

export default function Signin() {

  const [signInData, setSignInData] = useState({
    email_username: "",
    password: "",
  });
  const [agentSignInData, setAgentSignInData] = useState({
    agid: "",
    agpassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error,loading} =  useSelector((state)=>state.user)

  useEffect(()=>{
    dispatch(defaultRed());
    window.scrollTo(0,0);
  },[]);

  const toast = useToast();

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleUserChange = (e) => {
    setAgentSignInData({
      agid: "",
      agpassword: "",
    });
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleAgentChange = (e) => {
    setSignInData({
      email_username: "",
      password: "",
    });
    const { name, value } = e.target;
    setAgentSignInData({
      ...agentSignInData,
      [name]: value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    dispatch(signInStart());

    try {
      console.log("calling fetch");
      const res = await fetch("./api/auth/sign-in", {
        // function is used to send an asynchronous HTTP request to the server's signin API endpoint ("./api/auth/sign-in")
        method: "POST", // Adjust the HTTP method based on your API endpoint requirements
        headers: {
          "Content-Type": "application/json", //format of the request body
        },
        body: JSON.stringify(signInData), // Convert signInData to JSON
      });
      console.log("called fetch");

      await delay(1000);

      const data = await res.json(); //get json response in data

      // console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        await delay(2000);
        dispatch(signInSuccess(data));
        navigate("/");
        toast({
          title: 'Account login',
          description: "logged in successfully...",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleAgentSubmit = async (e) => {
    e.preventDefault();

    dispatch(signInStart());

    try {
      console.log("calling fetch");
      const res = await fetch("./api/auth/sign-in-agent", {
        // function is used to send an asynchronous HTTP request to the server's signin API endpoint ("./api/auth/sign-in-agent")
        method: "POST", // Adjust the HTTP method based on your API endpoint requirements
        headers: {
          "Content-Type": "application/json", //format of the request body
        },
        body: JSON.stringify(agentSignInData), // Convert agentSignInData to JSON
      });
      console.log("called fetch");

      await delay(1000);

      const data = await res.json(); //get json response in data

      // console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        await delay(2000);
        dispatch(signInSuccess(data));
        navigate("/agent-dashboard");
        toast({
          title: 'Account login',
          description: "logged in successfully...",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="ty:fixed df:static">

      <div className="flex min-h-auto items-center justify-center bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent ">       
        <div className="w-full max-w-md p-8 m-10 mb-20 bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Welcome to Dr.Estate
          </h1>
          <Tabs isFitted variant='enclosed'>
              <TabList mb='1em'>
                <Tab>User</Tab>
                <Tab>Agent</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form autoComplete="off" onSubmit={handleUserSubmit}>
                    <div className="mb-4 cursor-pointer">
                      <label
                        htmlFor="email_username"
                        className="text-gray-800 block mb-2 cursor-pointer"
                      >
                        Email or Username
                      </label>
                      <input
                        type="email_username"
                        id="email_username"
                        name="email_username"
                        value={signInData.email_username}
                        placeholder="Enter email or username"
                        autoComplete="on"
                        className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500"
                        required
                        onChange={handleUserChange}
                      />
                    </div>

                    <div className="mb-4 cursor-pointer">
                      <label
                        htmlFor="password"
                        className="text-gray-800 block mb-2 cursor-pointer"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={signInData.password}
                        placeholder="Enter password"
                        autoComplete="on"
                        className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500"
                        required
                        onChange={handleUserChange}
                      />
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      id="sign-in"
                      name="sign-in"
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      {loading ? "signing-in..." : "Continue"}
                    </button>
                  </form>
                  <p className="m-3 text-red-600 text-sm">{error}</p>
                  <p className="mt-4 text-gray-600 text-sm text-center">
                    Don't have an account?{" "}
                    <Link to="/sign-up">
                      <span className="text-blue-500">Register</span>
                    </Link>
                  </p>

                  <div className="flex flex- items-center justify-evenly m-3">
                    <div className="MyDivider"></div>
                    <div className="text-center text-lg px-3 pb-2 pt-1">or</div>
                    <div className="MyDivider"></div>
                  </div>

                  <GoogAuth/>
                  
                  <button className="flex justify-evenly w-full p-2 rounded  border border-black hover:bg-slate-300 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 "
                      fill="currentColor"
                      style={{ color: "#1877f2" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                    <div className="pb-1 w-4/5">Continue with Facebook</div>
                  </button>
                </TabPanel>
                <TabPanel>
                  <form autoComplete="off" onSubmit={handleAgentSubmit}>
                    <div className="mb-4 cursor-pointer">
                      <label
                        htmlFor="agentId"
                        className="text-gray-800 block mb-2 cursor-pointer"
                      >
                        Agent Id
                      </label>
                      <input
                        type="password"
                        id="agid"
                        name="agid"
                        value={agentSignInData.agid}
                        placeholder="Enter your agent id"
                        autoComplete="off"
                        className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500"
                        required
                        onChange={handleAgentChange}
                      />
                    </div>

                    <div className="mb-4 cursor-pointer">
                      <label
                        htmlFor="ag_password"
                        className="text-gray-800 block mb-2 cursor-pointer"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="agpassword"
                        name="agpassword"
                        value={agentSignInData.agpassword}
                        placeholder="Enter password"
                        autoComplete="off"
                        className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                  hover:border-blue-500"
                        required
                        onChange={handleAgentChange}
                      />
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      id="agent-sign-in"
                      name="agent-sign-in"
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      {loading ? "signing-in..." : "Continue"}
                    </button>
                  </form>
                  <p className="m-3 text-red-600 text-sm">{error}</p>
                  <p className="mt-4 text-gray-600 text-sm text-center">
                    Don't have an account?{" "}
                    <Link to="/sign-up">
                      <span className="text-blue-500">Register</span>
                    </Link>
                  </p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          
          
        </div>
      </div>
      <MyFooter/>
    </div>
  );
}
