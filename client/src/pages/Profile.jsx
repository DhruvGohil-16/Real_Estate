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
import Header from '../components/Header'
import { Link } from 'react-router-dom';
import { updateStart,updateFailure,updateSuccess, deleteStart, deleteFailure, deleteSuccess, defaultRed, signOutStart, signOutFailure, signOutSuccess } from '../myredux/user/userSlice.js';
import MyFooter from '../components/MyFooter.jsx';

export default function Profile() {

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const imgBrowse = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError,setFileError] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(defaultRed());
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);


  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleFileUpload = (file) => {
    if (file.size > 3 * 1024 * 1024) { // 3 MB in bytes
      setFileUploadError(true);
      setFileError("File size exceeds 3MB limit");
      return; // Stop further execution
    }
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
//     getMetadata(storageRef)
//     .then((metadata) => {
//       if (metadata) {
//         // File already exists, update metadata
//         const updatedMetadata = { contentType: file.type };
//         return updateMetadata(storageRef, updatedMetadata);
//       } else {
//         // File doesn't exist, proceed with upload
//         return uploadFile(storageRef, file);
//       }
//     })
//     .then(() => {
  //       setFileError('Image uploaded successfully!!!');
  //     })
  //     .catch((error) => {
    //       setFileUploadError(true);
    //       setFileError(error);
    //     });
    // };
    
    // const uploadFile = (storageRef, file) => {
      //   const uploadTask = uploadBytesResumable(storageRef, file);
      
      //   uploadTask.on(
        //     'state_changed',
        //     (snapshot) => {
          //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //       setFilePerc(Math.round(progress));
          //     },
          //     (error) => {
            //       setFileUploadError(true);
//       setFileError(error);
//     }
//   );

//   return uploadTask;
// };
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
      setFormData({ ...formData, profilePic: downloadURL });
      setFileError('Image uploaded successfully!!!');
      setFileUploadError(false); // Reset error state on successful upload
    }
    );
  }
  );
};

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
}

const handleSubmit = async (e) => {

  e.preventDefault();
  setFileError("");
  dispatch(updateStart());
  console.log(formData);
  try {
    const res = await fetch(`./api/user/update/${currentUser._id}`,{
      // function is used to send an asynchronous HTTP request to the server's update API endpoint ("./api/user/update/id")
      method: "POST", // Adjust the HTTP method based on your API endpoint requirements
      headers: {
        "Content-Type": "application/json", //format of the request body
      },
      body: JSON.stringify(formData), // Convert signInData to JSON
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

const handleDelete = async (e) => {
  setFileError("");
  dispatch(deleteStart());
  console.log(formData);
  try {
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
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
    const res = await fetch('/api/auth/sign-out');
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
    <div className="ty:fixed df:static">

      <div>
        <Header />
      </div>
      <div className="flex min-h-auto items-center justify-center bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent">
        <div className='w-full max-w-md m-10 mb-20 p-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl'>
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Dr.Estate Profile</h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className='mb-4 cursor-pointer flex justify-center flex-col'>
              
              <input onChange={(e)=>setFile(e.target.files[0])}
              type='file' ref={imgBrowse} hidden accept='image./*'></input>
              <img onClick={()=>imgBrowse.current.click()} src={formData.profilePic ||currentUser.profilePic} alt="profile" className='rounded-full border border-blue-300 ring-2 ring-blue-300 ring-offset-2 h-24 w-24 object-cover cursor-pointer text-center self-center my-3' />

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

              <label htmlFor="username" className="text-gray-800 block my-3 cursor-pointer">Username</label>
              <input type="text" defaultValue={currentUser.username} placeholder='username' id='username'  autoComplete="on"
                     onChange={handleChange}
                     className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500"  />

              <label htmlFor="email" className="text-gray-800 block my-3 cursor-pointer">Email</label>
              <input type="email" defaultValue={currentUser.email} placeholder='email' id='email' autoComplete="on"
                     onChange={handleChange}
                     className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500"  />

              <label htmlFor="password" className="text-gray-800 block my-3 cursor-pointer">Password</label>
              <input type="text" placeholder='password' id='password' className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500" />
              <button disabled={loading} type='submit' className="w-full mt-4 mb-2 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline" >{loading ? "updating..." : "Update Info"}</button>
            </div>
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
            
              <PopoverContent color='black' bg='blue.100' borderColor='black'>
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

          <Link to='/'><span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">List Property</span></Link>
          <span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Add Property</span>
          <span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Remove Property</span>
        </div>
      </div>
      <MyFooter/>
    </div>
  )
}