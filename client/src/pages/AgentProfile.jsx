import React, { useRef, useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useToast,Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverBody,PopoverFooter,PopoverArrow,PopoverCloseButton} from '@chakra-ui/react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateStart,updateFailure,updateSuccess, deleteStart, deleteFailure, deleteSuccess, defaultRed, signOutStart, signOutFailure, signOutSuccess } from '../myredux/user/userSlice.js';
import MyFooter from '../components/MyFooter.jsx';
import AgentHeader from '../components/AgentHeader.jsx';

export default function AgentProfile() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const imgBrowse = useRef(null);
    const [file,setFile] = useState(undefined);
    const [passerror,setPassError] = useState("");
    const [passLoading,setPassloading] = useState(false);
    const [pass,setPass] = useState("");
    const [filePerc, setFilePerc] = useState(0);
    const [fileError,setFileError] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [agentFormData, setAgentFormData] = useState({
        agname:currentUser.name,
        agpassword:"",
        agnewpassword:"",
        agemail:currentUser.email,
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
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(()=>{
        setAgentFormData({ ...agentFormData, country: currentUser.location.country, state: currentUser.location.state, city:  currentUser.location.city});
    },[]);
    useEffect(() => {
        dispatch(defaultRed());
        if (file) {
        handleFileUpload(file);
        }
    }, [file]);


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleAgentNewPasswordChange = (event) => {
        setPass(event.target.value);
    };
    
    const handlePassChange = (e) => {
        const {name,value} = e.target;
        if(value === "" && agentFormData.agpassword){
            setPassError("*new password cannot be empty!!!");
            setPassloading(false);
        }
        else{
            setAgentFormData({...agentFormData,agnewpassword:value});
            setPassError("");
            setPassloading(true);
        }
    }
    const handleLocationChange = (e) => {
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

    const handleFileUpload = (file) => {
        if (file.size > 3 * 1024 * 1024) { // 3 MB in bytes
        setFileUploadError(true);
        setFileError("File size exceeds 3MB limit");
        return; // Stop further execution
        }
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress));
        },
        (error) => {
            setFileUploadError(true);
            setFileError(error);
        },
        () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setAgentFormData({ ...agentFormData, profilePic: downloadURL });
                    setFileError('Image uploaded successfully!!!');
                    setFileUploadError(false); // Reset error state on successful upload
                }
            );
        }
        );
        };

        const handleChange = (e) => {
        setAgentFormData({ ...agentFormData, [e.target.id]: e.target.value });
    }

    const handleUpdate = async (e) => {
        console.log(agentFormData);
        console.log(currentUser._id);
        e.preventDefault();
        if(!agentFormData.agemail && !agentFormData.agname && !agentFormData.city && !agentFormData.country && !agentFormData.state){
            setPassError("*no updated field!!!");
            setFileError("");
        }
        else if(agentFormData.agpassword && !agentFormData.agnewpassword){
            setPassError("*please add new password!!!");
            setFileError("");
        }
        else{
            setFileError("");
            dispatch(updateStart());
            try {
                const res = await fetch(`./api/agent/update/${currentUser._id}`,{
                // function is used to send an asynchronous HTTP request to the server's update API endpoint ("./api/agent/update/id")
                method: "POST", // Adjust the HTTP method based on your API endpoint requirements
                headers: {
                    "Content-Type": "application/json", //format of the request body
                },
                body: JSON.stringify(agentFormData), // Convert signInData to JSON
                });
    
                const data = await res.json(); //get json response in data
    
                // console.log(data);
    
                if (data.success === false) {
                    dispatch(updateFailure(data.message));
                    return;
                } 
                    await delay(2000);
                    toast({
                    title: 'Profile updated',
                    description: "Your profile updated successfully.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                    });
    
                    dispatch(updateSuccess(data));
                    
                    
                } catch (error) {
                dispatch(updateFailure(error.message));
            }
        }

    }

    const handleDelete = async (e) => {
        setFileError("");
        dispatch(deleteStart());
        console.log(FormData);
        try {
            const res = await fetch(`/api/agent/delete/${currentUser._id}`, {
            method: 'DELETE',
            });

            const data = await res.json(); //get json response in data

            // console.log(data);

            if (data.success === false) {
                dispatch(deleteFailure(data.message));
                return;
            } 
                await delay(2000);

                dispatch(deleteSuccess(data));
                
            } catch (error) {
            dispatch(deleteFailure(error.message));
        };
    }

    const handleSignOut = async () =>{
        dispatch(signOutStart());
        try {
            const res = await fetch('/api/auth/sign-out-agent');
            const data = await res.json();
            if (data.success === false) {
            dispatch(signOutFailure(data.message));
            return;
            }
            
            dispatch(signOutSuccess(data));
            toast({
            title: 'Account logged out',
            description: "You have logged out successfully.",
            status: 'success',
            duration: 4000,
            isClosable: true,
            });
        } catch (error) {
            dispatch(signOutFailure(data.message));
        }
    }

  return (
    <div className="min-h-screen bg-gray-200 bg-gradient-to-b from-gray-300 to-transparent">

      <AgentHeader/>
      <div className="flex min-h-auto items-center justify-center bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent">
        <div className='w-full max-w-md m-10 mb-20 p-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl'>
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Dr.Estate Agent Profile</h1>
            <form autoComplete='off' onSubmit={handleUpdate}>
                <div className='mb-4 cursor-pointer flex justify-center flex-col'>   
                    <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={imgBrowse} hidden accept='image./*'></input>
                    <img onClick={()=>imgBrowse.current.click()} src={agentFormData.profilePic ||currentUser.profilePic} alt="profile" className='rounded-full border border-blue-300 ring-2 ring-blue-300 ring-offset-2 h-24 w-24 object-cover cursor-pointer text-center self-center my-3' />

                    <p className='text-sm self-center'>
                        {fileUploadError ? (
                        <span className='text-red-700'>
                            {error}
                        </span>
                        ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                        ) : filePerc === 100 ? (
                        <>
                            <span className='text-green-700'>{fileError}</span>
                        </>
                        ) : (
                        ''
                        )}
                    </p>
                </div>

                <div className="mb-4 cursor-pointer">
                    <label htmlFor="agname" className="text-gray-800 block mb-2 cursor-pointer">Full name</label>
                    <input type="text" id="agname" name="agname" placeholder="Enter your full name" defaultValue={currentUser.name}
                            className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                hover:border-blue-500" onChange={handleChange} />
                </div>
                <div className="mb-4 cursor-pointer">
                    <label htmlFor="agemail" className="text-gray-800 block mb-2 cursor-pointer" >Email</label>
                    <input type="email" id="agemail" name="agemail" defaultValue={currentUser.email} placeholder="Enter your professional email address" autoComplete='on'
                            className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                hover:border-blue-500" onChange={handleChange} />
                </div>

                <label className='block text-sm font-semibold text-gray-800 mb-3 mt-5'>( Which country, state & city do you work in ? )</label>
                <div className='grid grid-cols-3 gap-2'>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <select id="country" name="country" value={agentFormData.country} onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">--Select Country--</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                        <select id="state" name="state" value={agentFormData.state} onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option key="default" value="">--Select State--</option>
                        {stateOptions[agentFormData.country]?.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <select id="city" name="city" value={agentFormData.city} onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
                                hover:border-blue-500" onChange={handleChange}/>
                </div>
                <div className="mb-4 cursor-pointer">
                    <label htmlFor="agnewpassword" className="text-gray-800 block mb-2 cursor-pointer" >New Password</label>
                    <input type="password" id="agnewpassword" name="agnewpassword" placeholder="Enter your new password" value={pass}
                            className="w-full px-4 py-2 border rounded 
                                    focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                                hover:border-blue-500" onChange={handleAgentNewPasswordChange} onBlur={handlePassChange} />
                </div>
                <p className="m-3 text-red-600 text-sm">{passerror}</p>
                <button disabled={(loading && passLoading)} type='submit' className="w-full mt-4 mb-2 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline" >{loading ? "updating..." : "Update Info"}</button>
            </form>
          <p className="m-3 text-red-600 text-sm">{error}</p>
          <p className="m-4 text-gray-600 text-sm text-center">
            Want to logout ?{" "}
            <button onClick={handleSignOut}>
              <span className="text-blue-600">logout</span>
            </button>
          </p>

          <Popover>
            <PopoverTrigger>
              <button className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Remove Account</button>
            </PopoverTrigger>
            
              <PopoverContent color='black' bg='blue.200' borderColor='black'>
                <PopoverHeader pt={4} fontWeight='bold' border='0'>Confirmation</PopoverHeader>
                <PopoverArrow bg='black'/>
                <PopoverCloseButton />
                <PopoverBody>
                  Are you sure you want to delete the account?
                </PopoverBody>
                <PopoverFooter border='0'
                               display='flex'
                               alignItems='center'
                               justifyContent='space-between'
                               pb={4}>
                  <div className="flex justify-end">
                    <button disabled={loading} onClick={handleDelete} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">{loading ? "deleting..." : "Delete"}</button>
                  </div>
                </PopoverFooter>
              </PopoverContent>
            
          </Popover>
        </div>
      </div>
      <MyFooter/>
    </div>
  )
}