import React,{useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { BsFillHouseAddFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { FaHome, FaHammer, FaSwimmingPool} from "react-icons/fa";
import { FaLocationDot, FaHouseLock, FaRegCalendar } from "react-icons/fa6";
import { FcApproval } from "react-icons/fc";
import { TbRulerMeasure, TbReceiptTax } from "react-icons/tb";
import { PiPark } from "react-icons/pi";
import { MdAddHomeWork } from "react-icons/md";
import { GiElevator, GiHomeGarage, GiWoodBeam } from "react-icons/gi";
import { Modal, Button,useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    useToast,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,} from '@chakra-ui/react'
import Header from '../components/Header';
import MyFooter from '../components/MyFooter';
import ImageSlider from '../components/ImageSlider';
import ContactUs from './ContactUs';

export default function Buy() {

    const [listedProperties, setListedProperties] = useState([]);
    const [propIndex, setPropIndex] = useState(0);
    const [loading,setLoading] = useState(false);
    const [userPrice,setUserPrice] = useState(0);
    const [name,setName] = useState("");
    const [date, setDate] = useState(0);
    const [error, setError] = useState("");
    const { currentUser} = useSelector((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const handleIndexClick = (index) => {
        const currentDate = new Date();
        const listedDate = new Date(listedProperties[index].listedDate);
        console.log(currentDate);
        const differenceMs = currentDate - listedDate;
        console.log(differenceMs);
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        console.log(differenceDays);
        setDate(differenceDays);
        setPropIndex(index);
        onOpen();
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handlePriceChange = (e) => {
        if(e>listedProperties[propIndex].price || e>listedProperties[propIndex].discountPrice)
            alert("Your offer is more then asked.\nDo you want to continue?");
        setUserPrice(e);
    }

    const handleNameChange = (e) => {   
        setName(e.target.value)
    }

    const handleAgentRequest = async(e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {   
            console.log("calling fetch");
            const res = await fetch(`./api/user/buyReq/${currentUser._id}`, { 
                method: "post", // Adjust the HTTP method based on your API endpoint requirements
                headers: {
                "Content-Type": "application/json",  //format of the request body
            },
            body: JSON.stringify({offer:userPrice,property:listedProperties[propIndex],username:name}), // Convert FormData to JSON
            });
            console.log("called fetch");
            
            const data = await res.json(); //get json response in data

            if(data.success===false){
                setError(data.message);
            }
            else{
                setLoading(false);
                setError("*Request sent successfully!!!");
                await delay(2000);
                onClose();
                setName("");
                setError("");
                toast({
                    title: 'Buy request',
                    position: 'top',
                    description: "Your property buy request sent successfully.",
                    status: 'success',
                    duration: 6000,
                    isClosable: true,
                });
                navigate('/buy');
            }
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    const handleContactAgent = (id) => {
        if(id===currentUser._id)
            setError("*You cannot buy your own property!!!");
        else
            setLoading(true)
    }
    const fetchListedProperties = async () => {
        setError('');
        try {
            const response = await fetch(`/api/listing/verifiedProp/${currentUser._id}`);
            const Data = await response.json();
            
            if (Data.success === false)
                setError(Data.message);
            else{
                setError('');
                setListedProperties(Data.data);
            }
            console.log(Data.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        window.scrollTo(0,0);
        fetchListedProperties();
    }, []);

  return (
    <div>
        

        <div className='flex min-h-screen bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent'>
            <div className="container mx-auto py-8 ">
                <div className="text-xl font-bold text-gray-800 mx-6">Recommended Properties</div>
                {listedProperties.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listedProperties.map((property,index) => (
                            <div key={property._id} className="bg-slate-200 shadow-lg rounded-xl m-6">
                                <img src={property.images[0].url} onClick={() => handleIndexClick(index)} alt={property.propertyName} className="w-full h-44 rounded-t-md mb-4 cursor-pointer" />
                                <div className='m-6'>
                                    {property.offer && (
                                        <div className='flex flex-row w-fit gap-2'>
                                            <div className="text-black text-black/75 text-lg line-through font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property.price)}</div>
                                            <div className='text-black text-xl font-semibold font-serif'>₹{Intl.NumberFormat('en-IN').format(property.discountPrice)}</div>
                                        </div>
                                    )}
                                    {!property.offer && (
                                        <div className="text-black text-xl font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property.price)}</div>
                                    )}
                                    <div className="flex flex-row gap-7 justify-start my-4">
                                        <div className="text-gray-600 "><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(property.bedrooms)}</span> bed</div>
                                        <div className="text-gray-600"><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(property.bathrooms)}</span> bath</div>
                                        <div className="text-gray-600"><span className='text-black font-bold font-serif'>{Intl.NumberFormat('en-IN').format(property.sqarea)}</span> sqft</div>
                                    </div>
                                    <div className='grid grid-flow-col gap-2'>
                                        <p className="text-gray-600 text-balance font-serif w-9/12 overflow-hidden line-clamp-3 text-ellipsis">{property.address}</p>
                                        <div className='flex justify-end flex-col'>
                                            <Button colorScheme='teal' width='fit-content' fontFamily='serif' onClick={() => handleIndexClick(index)}>More Info</Button>
                                            <div className='flex font-serif mt-px items-center'>Status : <FcApproval className=' mt-1 ml-1' size={25}/></div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No properties listed...</p>
                )}
                
                { listedProperties[propIndex] && <Modal isOpen={isOpen} size='full' onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontFamily='serif' fontSize={32} textTransform='uppercase' textAlign='left' >{listedProperties[propIndex].propertyName}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div>
                                <div className='flex flex-row gap-1 ml-8 pl-2 items-center'>
                                    <img src={listedProperties[propIndex].agentProfile} alt="Profile" className="w-8 h-8 rounded-full" />
                                    <div className='flex flex-col gap-1 font-serif pl-1'>
                                        <div className='text-xs text-black/70'>Presented by:</div>
                                        <div><span className='font-semibold text-sm'>{listedProperties[propIndex].agentName}</span> with <span className='font-semibold text-sm'>The Agency</span></div>
                                    </div>
                                </div>
                                <ImageSlider images={listedProperties[propIndex].images} />
                                <div className='grid grid-flow-row gap-2 m-4'>
                                    {listedProperties[propIndex].offer && (
                                        <div className='flex flex-row gap-2'>
                                            <div className="text-black text-2xl line-through font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].price)}</div>
                                            <div className='text-black text-3xl font-semibold font-serif'>₹{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].discountPrice)}</div>
                                        </div>
                                    )}
                                    {!listedProperties[propIndex].offer && (
                                        <div className="text-black text-3xl font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].price)}</div>
                                    )}
                                    {/* <div className='flex flex-row gap-10'>
                                        <Popover size='xl'>
                                            <PopoverTrigger>
                                                <div>Est. </div>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverCloseButton />
                                                <PopoverHeader fontFamily='serif' fontSize={26}>Monthly payment</PopoverHeader>
                                                <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    </div> */}
                                    <div className="flex flex-row gap-7 justify-start my-4">
                                        <div className="text-black "><span className='font-bold'>{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].bedrooms)}</span> bed</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].bathrooms)}</span> bath</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(listedProperties[propIndex].sqarea)}</span> sqft</div>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center mb-4 pb-2 border-solid border-black border-b-2'>
                                        <FaLocationDot size={25} />
                                        <p className="text-black/80 text-balance font-serif text-lg ">{listedProperties[propIndex].address}</p>                                                              
                                    </div>
                                    <div className='w-3/5 mb-5'>
                                        <div className='grid grid-cols-3 gap-y-10'>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHome size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{listedProperties[propIndex].propertyType}</span>
                                                    <span className='text-sm font-serif text-black/60'>Property type</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaRegCalendar size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{date} days</span>
                                                    <span className='text-sm font-serif text-black/60'>Time on DrEstate.com</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <TbRulerMeasure size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format((listedProperties[propIndex].price)/(listedProperties[propIndex].sqarea))}</span>
                                                    <span className='text-sm font-serif text-black/60'>Price per sqft</span>
                                                </div>
                                            </div>
                                            {listedProperties[propIndex].amenities[0].parking && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiHomeGarage size={25} />
                                                        <div className='flex flex-col'>
                                                            <span className='text-lg font-serif font-semibold'>{listedProperties[propIndex].noOfVehicle} <span className='text-sm'>Vehicle</span></span>
                                                            <span className='text-sm font-serif text-black/60'>Parking</span>
                                                        </div>
                                                    </div>
                                            )}
                                            {listedProperties[propIndex].furnished && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiWoodBeam size={25} />
                                                        <span className='font-serif font-semibold'>Furnished</span>
                                                    </div>
                                            )}
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHammer size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{listedProperties[propIndex].builtDate}</span>
                                                    <span className='text-sm font-serif text-black/60'>Build</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <TbReceiptTax size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format(12500)}</span>
                                                    <span className='text-sm font-serif text-black/60'>HOA fees</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Accordion className='mt-4 mx-4' allowToggle>
                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton borderColor='black' borderTop='2px solid'>
                                            <Box as="span" flex='1' textAlign='left'>
                                                <div className='flex flex-row gap-1'>
                                                    <MdAddHomeWork size={25}/>
                                                    <span className='font-serif font-bold text-xl text-black hover:text-black/60'>Amenities</span>
                                                </div>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel className='text-balance font-serif' pb={4}>
                                            <div className='grid grid-cols-3 gap-3 m-3'>
                                                {listedProperties[propIndex].amenities[0].swimmingPool && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaSwimmingPool size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Swimming Pool</span>
                                                    </div>
                                                )}
                                                {listedProperties[propIndex].amenities[0].elevator && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiElevator size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Elevator</span>
                                                    </div>
                                                )}
                                                {listedProperties[propIndex].amenities[0].security && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaHouseLock size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Security</span>
                                                    </div>
                                                )}
                                                {listedProperties[propIndex].amenities[0].garden && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <PiPark size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Garden</span>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>                                             
                                </Accordion>
                                <Accordion className='mx-4 mb-10' allowToggle>
                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton borderColor='black'  borderTop='2px solid'>
                                            <Box as="span" flex='1' textAlign='left'>
                                                <div className='flex flex-row gap-1'>
                                                    <BsFillHouseAddFill size={25}/>
                                                    <span className='font-serif font-bold text-xl text-black hover:text-black/60'>Property Details</span>
                                                </div>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel className='text-balance font-serif' pb={4}>{listedProperties[propIndex].description}</AccordionPanel>
                                    </AccordionItem>                                             
                                </Accordion>
                                <div className='flex flex-col justify-center m-4 gap-2'>
                                    {!loading && 
                                        (<button onClick={()=>handleContactAgent(listedProperties[propIndex].user)} className='flex justify-evenly w-full p-2 rounded font-serif  border border-black hover:bg-gray-800 hover:text-white'>Contact Agent</button>)
                                    }

                                    {loading && 
                                    (
                                        <form autoComplete='off' method='POST' onSubmit={handleAgentRequest}> 
                                            <div className='flex flex-row gap-14 border-black/50 border-2 w-fit p-4 rounded-lg'>
                                                <div className='flex flex-col gap-2'>   
                                                    <label htmlFor="price" className="block font-serif text-lg text-black">Your offer price</label>
                                                    <NumberInput onChange={handlePriceChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-black rounded-md bg-gray-50" min={1000} precision={2} step={100000}>
                                                        <NumberInputField value={userPrice}/>
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper/>
                                                            <NumberDecrementStepper/>
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                    <input type='text' id="name" name="name" required placeholder='Enter your full-name' value={name} onChange={handleNameChange} className='mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50'/>
                                                </div>
                                                <div className='flex justify-end flex-col gap-2 items-start'>
                                                    <button type='submit' className='w-fit h-fit p-2 rounded-lg font-serif  border border-black hover:bg-red-600 hover:text-white'>Send Request</button>
                                                    <button onClick={()=>{setLoading(false);setError('');setName('')}} className='w-fit h-fit p-2 rounded-lg font-serif  border border-black hover:bg-red-600 hover:text-white'>Cancel</button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                                <p className="m-3 text-red-600 font-serif text-lg">{error}</p>
                            </div>
                        </ModalBody>
                        <MyFooter/>
                    </ModalContent>
                </Modal>}
            </div>
        </div>
        <ContactUs/>
        <MyFooter/>
    </div>
  )
}
