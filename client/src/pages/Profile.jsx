import React, { useRef, useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import Header from '../components/Header'
import { Link } from 'react-router-dom';

export default function Profile() {

  const {currentUser} = useSelector((state) => state.user);
  const imgBrowse = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [error,setError] = useState(null);
  console.log(file);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 3 * 1024 * 1024) { // 3 MB in bytes
      setFileUploadError(true);
      setError("File size exceeds 3MB limit");
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
//       setError('Image uploaded successfully!!!');
//     })
//     .catch((error) => {
//       setFileUploadError(true);
//       setError(error);
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
//       setError(error);
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
        setError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData({ ...formData, profilePic: downloadURL });
              setError('Image uploaded successfully!!!');
              setFileUploadError(false); // Reset error state on successful upload
          }
        );
      }
    );
  };

  return (
    <div className="ty:fixed df:static">

      <div className="blur-sm">
        <Header />
      </div>
      <div className="flex items-center justify-center backdrop-blur-sm">
        <div className='w-full max-w-md p-8 -mt-8 overflow-y-auto bg-slate-200 rounded-lg border border-blue-100 ring-2 ring-blue-300 ring-offset-2 shadow-xl'>
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Dr.Estate Profile</h1>
          <form autoComplete="off">
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
                    <span className='text-green-700'>{error}</span>
                  </>
                ) : (
                  ''
                )}
              </p>

              <label htmlFor="username" className="text-gray-800 block my-3 cursor-pointer">Username</label>
              <input type="text" value={currentUser.username} placeholder='username' id='username' className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500"  />

              <label htmlFor="username" className="text-gray-800 block my-3 cursor-pointer">Email</label>
              <input type="email" value={currentUser.email} placeholder='email' id='email' className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500"  />

              <label htmlFor="password" className="text-gray-800 block my-3 cursor-pointer">Password</label>
              <input type="text" placeholder='password' id='password' className="w-full px-4 py-2 border rounded 
                              focus:outline-none focus:ring-2 focus:drop-shadow-md focus:duration-200 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 focus:border-blue-500
                            hover:border-blue-500" />
              <button className="w-full mt-4 mb-2 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">Update Info</button>
            </div>
          </form>
          <p className="m-3 text-red-600 text-sm"></p>
          <p className="m-4 text-gray-600 text-sm text-center">
            Want to logout ?{" "}
            <button>
              <span className="text-blue-600">logout</span>
            </button>
          </p>

          <span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Delete account</span>
          <Link to='/'><span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">List Property</span></Link>
          <span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Add Property</span>
          <span className="flex justify-evenly w-full p-2 rounded border border-black hover:bg-slate-300 mb-4 cursor-pointer">Remove Property</span>
        </div>
      </div>
    </div>
  )
}