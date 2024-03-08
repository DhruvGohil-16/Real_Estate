import React from 'react'
import { useNavigate } from "react-router-dom"
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { FcGoogle } from "react-icons/fc"
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../myredux/user/userSlice'
import {app} from '../firebase'

export default function GoogAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth,provider);
            
            const res = await fetch('./api/auth/googleAuth',{  // function is used to send an asynchronous HTTP request to the server's signup API endpoint ("./api/auth/sign-up")
                    method: "POST", // Adjust the HTTP method based on your API endpoint requirements
                    headers: {
                      "Content-Type": "application/json",  //format of the request body
                  },
                  body: JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL,
                  }), // Convert FormData to JSON
            });

            const data = await res.json();

            dispatch(signInSuccess(data));
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
        <button onClick={handleGoogleLogin} className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4">
            <FcGoogle className='h-7 w-7'/>
            <div className='pb-1 w-4/5'>Continue with Google</div>
        </button>
    </>
  )
}
