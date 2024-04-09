import React,{useEffect,useState} from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';
import { FaHome, FaHammer, FaSwimmingPool} from "react-icons/fa";
import { FaLocationDot,FaHouseLock } from "react-icons/fa6";
import { TbRulerMeasure, TbReceiptTax } from "react-icons/tb";
import { GiHomeGarage, GiWoodBeam } from "react-icons/gi";
import { useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,}from '@chakra-ui/react'
import MyFooter from '../components/MyFooter'
import { useNavigate } from 'react-router-dom';

export default function NewBuyLead() {

    const [newBuyLeads,setNewBuyLeads] = useState([]);
    const [rejMessage, setRejMessage] = useState("");
    const [data,setData] = useState([]);
    const [error, setError] = useState("");
    const [loading,setLoading] = useState(false);
    const [listloading,setListLoading] = useState(false);
    const [rejloading,setRejLoading] = useState(false);
    const [view,setView] = useState(false);
    const [propIndex, setPropIndex] = useState(0);
    const { currentUser} = useSelector((state) => state.user);
    const colors = ['#E38627', '#C13C37', '#6A2135', '#FF5733','#00FF00'];
    const toast = useToast();
    const navigate = useNavigate();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleClose = () => {
        const updatedLeads = [...newBuyLeads]; // Create a copy of the array
        updatedLeads.splice(propIndex, 1);
        setNewBuyLeads(updatedLeads);

        window.location.reload();
        setView(false);
    }
    const handleIndexClick = async(index) => {
        setError('');
        setPropIndex(index);
        setView(true);
        try {
            const res = await fetch(`./api/agent/updateNewBuyCount/${currentUser._id}`, { 
                method: "PATCH", // Adjust the HTTP method based on your API endpoint requirements
                headers: {
                "Content-Type": "application/json",  //format of the request body
            },
            body: JSON.stringify({propId:newBuyLeads[index].requestId,userId:newBuyLeads[index].newUser._id}), // Convert FormData to JSON
            });
            console.log("called fetch");
            const Data = await res.json();
            
            console.log(Data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        setRejMessage(e.target.value);
    }

    const handleVerify = async(status) => {
        setError('');
        setRejMessage('');
        console.log("called");
        var flag;
        
        if(status==1){
            setListLoading(true);
            setLoading(true);
            flag = fetchVerify(status);
        }
        else{
            setRejLoading(true);
            setLoading(true);
            if(rejMessage){
                flag = fetchVerify(status);
            }
            else{
                setRejMessage("*required");
                setLoading(false);
                setListLoading(false);
                setRejLoading(false);
                return;
            }
        };
        const result = await flag;

        if (result === 0) {
            const mess = status === 1 ? 'accepted' : 'rejected';
            
            setListLoading(false);
            setRejLoading(false);
            setRejMessage('');
            
            await delay(1000);
            setLoading(false);
            setView(false);
            toast({
                title: 'Buy request update',
                description: `Property buying request has been ${mess}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/new-buy-leads');
        }
        else{
            setLoading(false);
            setListLoading(false);
            setRejLoading(false);
            setRejMessage('*request already updated!!!');
        }
    };

    const fetchVerify = async(status) => {
        try {   
            console.log("calling fetch");
            const res = await fetch(`./api/agent/updateListReq/${currentUser._id}`, { 
                method: "PATCH", // Adjust the HTTP method based on your API endpoint requirements
                headers: {
                "Content-Type": "application/json",  //format of the request body
            },
            body: JSON.stringify({status,buyLead:recentBuyLeads[propIndex],rejMessage}), // Convert FormData to JSON
            });
            console.log("called fetch");
            
            const data = await res.json(); //get json response in data

            if (data.success===false){
                setError(data.message);
                return 1;
            }

        } catch (error) {
            setError(error.message);
            return 1;
        }
        return 0;
    }

    const fetchNewBuyLeads = async () => {
        setError('');
        try {
            const response = await fetch(`/api/agent/NewBuyReq/${currentUser._id}`);
            const Data = await response.json();
            
            if (Data.success === false)
                setError(Data.message);
            else{
                setError('');
                Data.data.forEach(item => {
                        const dateString = item.date;

                        const givenDate = new Date(dateString);
                        
                        console.log(givenDate);
                        const currentDate = new Date();
                        console.log(currentDate);
                        var time = null;

                        const timeDiff = currentDate.getTime() - givenDate.getTime();

                        const diffInMinutes = Math.ceil(timeDiff / (1000 * 60));
                        const diffInDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        const diffInHours = Math.floor(timeDiff / (1000*60*60));

                        if (currentDate.toDateString() === givenDate.toDateString()) {
                            if(diffInHours===0)
                                time = `${diffInMinutes} mins`;
                            else
                            time = `${diffInHours} hrs`;
                        } else {
                            time = `${diffInDays} days`;
                        }
                        item.time = time;
                    });
                setNewBuyLeads(Data.data);

                console.log(Data);
            }
        } catch (error) {
            setError(error);
        }
    };

    const fetchCounts = async () => {
        try {
            const response = await fetch(`/api/agent/totalReqCount/${currentUser._id}`);
            const Data = await response.json();
            
            if (Data.success === true){
            console.log(Data);
            const newData = Object.entries(Data.data).map(([label, value], index) => ({
                value,
                color: colors[index % colors.length],
                label
            }));
            setData(newData);
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCounts();
        fetchNewBuyLeads();
        window.scrollTo(0,0);
        
    }, []);
    useEffect(()=>{},[newBuyLeads])

  return (
    <div className="min-h-screen bg-gray-200 bg-gradient-to-b from-gray-300 to-transparent">
      
        <div className="container mx-auto px-4 py-8 mb-3 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                <div className='flex flex-col gap-4'>
                    <div className="col-span-1 md:col-span-1 h-fit bg-white shadow-lg p-4 rounded-md ">
                    <h1 className="text-lg font-semibold text-gray-800 mb-4">Agent Dashboard</h1>
                    <ul className="space-y-2">
                        <li>
                        <Link to="/agent-dashboard" className="text-blue-500 hover:text-blue-700">Home</Link>
                        </li>
                        <li>
                        <Link to="/properties" className="text-blue-500 hover:text-blue-700">Properties</Link>
                        </li>
                        <li>
                        <Link to="/agent-profile" className="text-blue-500 hover:text-blue-700">Profile</Link>
                        </li>
                    </ul>
                    </div>
                    <div className='bg-white p-4 flex rounded-md flex-col'>
                        <div className='text-lg font-semibold text-gray-800 mb-4'>Your Property listing History</div>
                        <PieChart
                        data={data}
                        label={({ dataEntry }) => `${dataEntry.value} (${dataEntry.label})`}
                        labelStyle={{
                            fontSize: '5px',
                            fontFamily: 'serif',
                            fill: 'white',
                        }}
                        style={{ width: '100%', height: '300px' }}
                        />
                    </div>
                </div>

                <div className="col-span-2 md:col-span-2 bg-white shadow-lg p-6 rounded-md">
                    <h3 className="text-lg font-serif font-bold">New Buy Request</h3>
                    <div className='flex flex-col gap-1 mt-3 justify-center'>
                        {newBuyLeads.length ? (
                            <div className="flex flex-col w-full h-10">
                                {newBuyLeads.map((request,index) => (
                                    <div key={index} className="bg-slate-200 shadow-lg rounded-xl m-6 p-3">
                                        <div className='grid gap-1 items-center'>
                                            <div className='grid grid-flow-col gap-1 items-center'>
                                                <div className='flex gap-3'>
                                                    <img src={request.newUser.profilePic} onClick={() => handleIndexClick(index)} alt="buyer pic" className="w-14  rounded-xl" />
                                                    <div className='flex flex-col gap-2'>
                                                        <div className='flex  gap-1 items-center'>
                                                            <div className='font-serif '>{request.buyerName} </div>
                                                            <div className='text-xs font-light'>requested {request.time} ago</div>
                                                        </div>
                                                        <div className='text-sm font-serif' >for : <span className='font-semibold uppercase '>{request.permList.propertyName}, {request.permList.city}, {request.permList.state}, {request.permList.country}</span></div>
                                                    </div>
                                                </div>
                                                <div className='grid justify-end'>
                                                    <button className='p-2 font-serif bg-green-500 rounded-lg' onClick={()=>handleIndexClick(index)}>View</button>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No new buy leads...</p>
                        )}
                    </div>
                    {view && (
                        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/45">
                            
                            <div className="bg-slate-200 shadow-lg rounded-xl w-4/6 m-6">
                                <div className='m-6 flex flex-col'>
                                    <div className='text-xl font-serif font-semibold mb-3 text-black'>Property Details</div>
                                    <div className='flex flex-col mb-3'>
                                        <div className='flex'>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHome size={25} />                                                          
                                                <div className='font-serif capitalize text-start font-semibold text-black text-lg'>{newBuyLeads[propIndex].permList.propertyType}</div>
                                            </div>
                                            <div className='font-serif capitalize text-start font-semibold text-black text-lg'> : {newBuyLeads[propIndex].permList.propertyName}</div>
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-7 justify-start my-4">
                                                    <div className="text-gray-600 "><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].permList.bedrooms)}</span> bed</div>
                                                    <div className="text-gray-600"><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].permList.bathrooms)}</span> bath</div>
                                                    <div className="text-gray-600"><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].permList.sqarea)}</span> sqft</div>
                                            </div>
                                            <div className='grid grid-cols-3 gap-y-2'>
                                                <div className='flex flex-row gap-3 items-center'>
                                                    <FaHome size={25} />
                                                    <div className='flex flex-col'>
                                                        <span className='font-serif font-semibold'>{newBuyLeads[propIndex].permList.propertyType}</span>
                                                        <span className='text-sm font-serif text-black/60'>Property type</span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-3 items-center'>
                                                    <TbRulerMeasure size={20} />
                                                    <div className='flex flex-col'>
                                                        <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format((newBuyLeads[propIndex].permList.price)/(newBuyLeads[propIndex].permList.sqarea))}</span>
                                                        <span className='text-sm font-serif text-black/60'>Price per sqft</span>
                                                    </div>
                                                </div>
                                                {newBuyLeads[propIndex].permList.amenities[0].parking && (
                                                        <div className='flex flex-row gap-3 items-center'>
                                                            <GiHomeGarage size={20} />
                                                            <div className='flex flex-col'>
                                                                <span className='text-lg font-serif font-semibold'>{newBuyLeads[propIndex].permList.noOfVehicle} <span className='text-sm'>Vehicle</span></span>
                                                                <span className='text-sm font-serif text-black/60'>Parking</span>
                                                            </div>
                                                        </div>
                                                )}
                                                {newBuyLeads[propIndex].permList.furnished && (
                                                        <div className='flex flex-row gap-3 items-center'>
                                                            <GiWoodBeam size={20} />
                                                            <span className='font-serif font-semibold'>Furnished</span>
                                                        </div>
                                                )}
                                                <div className='flex flex-row gap-3 items-center'>
                                                    <FaHammer size={20} />
                                                    <div className='flex flex-col'>
                                                        <span className='font-serif font-semibold'>{newBuyLeads[propIndex].permList.builtDate}</span>
                                                        <span className='text-sm font-serif text-black/60'>Build</span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-3 items-center'>
                                                    <TbReceiptTax size={20} />
                                                    <div className='flex flex-col'>
                                                        <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format(12500)}</span>
                                                        <span className='text-sm font-serif text-black/60'>HOA fees</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center mb-4 pb-2'>
                                        <FaLocationDot size={25} />                                                          
                                        <p className="text-gray-600 text-balance font-serif overflow-hidden line-clamp-3 text-ellipsis">{newBuyLeads[propIndex].permList.address}</p>
                                    </div>
                                </div>
                                <div className="mt-2 mb-4 flex justify-center">
                                    <div className="h-px w-4/5 bg-black dark:bg-gray-700" />
                                </div>
                                <div className='grid grid-cols-2 mx-6'>
                                    <div className='border-r-2 border-black'>
                                        <div className='mt-2 justify-start flex flex-col'>
                                            <div className='mb-1 text-xl flexs font-serif font-semibold text-black'>Buyer Details</div>
                                            <div className='flex flex-row gap-2'>
                                                <div className='text-black text-xl font-semibold font-serif'>offer : ₹{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].offer)}</div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-3 justify-start my-4">
                                                <div className="text-gray-600 ">Name    : <span className='text-black font-bold font-serif'>{(newBuyLeads[propIndex].buyerName)}</span></div>
                                                <div className="text-gray-600 ">Contact : <span className='text-black font-bold font-serif'>{(newBuyLeads[propIndex].newUser.email)}</span></div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-l-2 border-black'>
                                        <div className='ml-2 mt-2 justify-center flex flex-col'>
                                            <div className='mb-1 text-xl flexs font-serif font-semibold text-black'>Owner Details</div>
                                            <div className='flex flex-row gap-2'>
                                                {newBuyLeads[propIndex].permList.offer && (
                                                    <div className='text-black text-xl font-semibold font-serif'>Ask : ₹{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].permList.discountPrice)}</div>
                                                )}
                                                {!newBuyLeads[propIndex].permList.offer && (
                                                    <div className="text-black text-xl font-semibold font-serif">Ask : ₹{Intl.NumberFormat('en-IN').format(newBuyLeads[propIndex].permList.price)}</div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-3 justify-start my-4">
                                                <div className="text-gray-600 ">Name    : <span className='text-black font-bold font-serif'>{(newBuyLeads[propIndex].permList.owner)}</span></div>
                                                <div className="text-gray-600 ">Contact : <span className='text-black font-bold font-serif'>{(newBuyLeads[propIndex].permList.userEmail)}</span></div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='m-4 flex flex-row gap-4 items-center '>
                                    <button disabled={loading} onClick={()=>handleVerify(1)} className="flex justify-evenly items-center h-fit w-full p-2 shadow-lg shadow-black/20 rounded font-serif  border border-black hover:bg-green-800 hover:text-white mb-4">{listloading ? 'loading...' : 'Accept'}</button>
                                    <Popover>
                                        <PopoverTrigger>
                                            <button disabled={loading} className="flex justify-evenly items-center w-full h-fit p-2 shadow-lg shadow-black/20 rounded font-serif border border-black hover:bg-gray-800 hover:text-white mb-4">{rejloading ? 'loading...' : 'Reject'}</button>
                                        </PopoverTrigger>
                                        <PopoverContent borderColor='black'>
                                            <PopoverCloseButton />
                                            <PopoverHeader fontFamily='serif' fontSize={26}>Confirmation!!</PopoverHeader>
                                            <PopoverBody>
                                                <>
                                                    <div className='flex flex-col'>
                                                        <label className='font-serif'>Reason for rejection</label>
                                                        <textarea placeholder='enter description' id="description" name="description" onChange={handleChange} value={rejMessage} className="mb-4 p-3 block w-full  h-auto min-h-20 sm:text-sm border-gray-300 rounded-md bg-gray-50"/>
                                                    </div>
                                                    <div className="my-4">
                                                        <div className="h-px bg-black/30 dark:bg-gray-700" />
                                                    </div>
                                                    <button disabled={loading} onClick={()=>handleVerify(-1)} className='flex justify-evenly items-center text-center w-full p-2 rounded font-serif  border border-black hover:bg-gray-800 hover:text-white mb-4'>Reject</button>                                  
                                                </>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <button disabled={loading} onClick={handleClose} className="flex justify-evenly items-center w-full h-fit p-2 shadow-lg shadow-black/20 rounded font-serif  border border-black hover:bg-red-800 hover:text-white mb-4">close</button>
                                </div>

                            </div>
                        </div>
                    )}
                    
                 </div>

            </div>
        </div>
        <MyFooter/>
    </div>
      
  )
}
