import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error,loading} =  useSelector((state)=>state.user)

  useEffect(()=>{dispatch(defaultRed())},[]);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
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
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="ty:fixed df:static">
      <div className="blur-sm">
        <Header />
      </div>

      <div className="flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-md p-8 -mt-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Welcome to Dr.Estate
          </h1>

          <form autoComplete="off" onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
        </div>
      </div>
      <MyFooter/>
    </div>
  );
}
