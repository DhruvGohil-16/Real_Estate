import React,{useEffect,useState} from 'react'
import {useSelector} from 'react-redux'
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaHome, FaHammer, FaSwimmingPool} from "react-icons/fa";
import { FaLocationDot,FaHouseLock } from "react-icons/fa6";
import { TbRulerMeasure, TbReceiptTax } from "react-icons/tb";
import { PiPark } from "react-icons/pi";
import { MdAddHomeWork } from "react-icons/md";
import { GiElevator, GiHomeGarage, GiWoodBeam } from "react-icons/gi";
import {Modal,
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
    Box,Button,useDisclosure}from '@chakra-ui/react'
import AgentHeader from '../components/AgentHeader'
import MyFooter from '../components/MyFooter'
import ImageSlider from '../components/ImageSlider';

export default function RecentLeads() {

    const [recentLeads,setRecentLeads] = useState([]);
    const [error, setError] = useState("");
    const [propIndex, setPropIndex] = useState(0);
    const { currentUser} = useSelector((state) => state.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleIndexClick = (index) => {
        setPropIndex(index);
        onOpen();
    }

    const fetchRecentLeads = async () => {
        setError('');
        try {
            const response = await fetch(`/api/agent/verifyRecentReq/${currentUser._id}`);
            const Data = await response.json();
            
            if (Data.success === false)
                setError(Data.message);
            else{
                setError('');
                const newData = Data.data.map(item => ({ ...item, render: false }));
                setRecentLeads(newData);
                console.log(newData);
            }
        } catch (error) {
            setError(error);
        }

    };

    useEffect(() => {
        window.scrollTo(0,0);
        fetchRecentLeads();
    }, []);

  return (
    <div>
        <AgentHeader/>
        <div className='flex min-h-screen bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent'>
            <div className="container mx-auto py-8 ">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Properties</h2>
                {recentLeads.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentLeads.map((property,index) => (
                            <div key={property._id} className="bg-slate-200 shadow-lg rounded-md m-6">
                                <img src={property.images[0].url} alt={property.propertyName} className="w-full h-60 rounded-t-md mb-4" />
                                <div className='m-6'>
                                    {property.offer && (
                                        <div className='flex flex-row gap-2'>
                                            <div className="text-black text-black/75 text-lg line-through font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property.price)}</div>
                                            <div className='text-black text-xl font-semibold font-serif'>₹{Intl.NumberFormat('en-IN').format(property.discountPrice)}</div>
                                        </div>
                                    )}
                                    {!property.offer && (
                                        <div className="text-black text-xl font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property.price)}</div>
                                    )}
                                    <div className="flex flex-row gap-7 justify-start my-4">
                                        <div className="text-gray-600 "><span className='text-black font-bold'>{Intl.NumberFormat('en-IN').format(property.bedrooms)}</span> bed</div>
                                        <div className="text-gray-600"><span className='text-black font-bold'>{Intl.NumberFormat('en-IN').format(property.bathrooms)}</span> bath</div>
                                        <div className="text-gray-600"><span className='text-black font-bold'>{Intl.NumberFormat('en-IN').format(property.sqarea)}</span> sqft</div>
                                    </div>
                                    <div className='grid grid-flow-col gap-2'>
                                        <p className="text-gray-600 text-balance font-serif w-9/12 overflow-hidden line-clamp-3 text-ellipsis">{property.address}</p>
                                        <div className='flex justify-end'>
                                            <Button colorScheme='teal' width='fit-content' fontFamily='serif' onClick={() => handleIndexClick(index)}>More Info</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recent leads...</p>
                )}
                { recentLeads[propIndex] && <Modal isOpen={isOpen} size='full' onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontFamily='serif' fontSize={32} textTransform='uppercase' textAlign='left' >{recentLeads[propIndex].propertyName}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div>
                                <ImageSlider images={recentLeads[propIndex].images} />
                                <div className='grid grid-flow-row gap-2 m-4'>
                                    {recentLeads[propIndex].offer && (
                                        <div className='flex flex-row gap-2'>
                                            <div className="text-black text-2xl line-through font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].price)}</div>
                                            <div className='text-black text-3xl font-semibold font-serif'>₹{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].discountPrice)}</div>
                                        </div>
                                    )}
                                    {!recentLeads[propIndex].offer && (
                                        <div className="text-black text-3xl font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].price)}</div>
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
                                        <div className="text-black "><span className='font-bold'>{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].bedrooms)}</span> bed</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].bathrooms)}</span> bath</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(recentLeads[propIndex].sqarea)}</span> sqft</div>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center mb-4 pb-2 border-solid border-black border-b-2'>
                                        <FaLocationDot size={25} />
                                        <p className="text-black/80 text-balance font-serif text-lg ">{recentLeads[propIndex].address}</p>                                                              
                                    </div>
                                    <div className='w-3/5 mb-5'>
                                        <div className='grid grid-cols-3 gap-y-10'>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHome size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{recentLeads[propIndex].propertyType}</span>
                                                    <span className='text-sm font-serif text-black/60'>Property type</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <TbRulerMeasure size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format((recentLeads[propIndex].price)/(recentLeads[propIndex].sqarea))}</span>
                                                    <span className='text-sm font-serif text-black/60'>Price per sqft</span>
                                                </div>
                                            </div>
                                            {recentLeads[propIndex].amenities[0].parking && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiHomeGarage size={25} />
                                                        <div className='flex flex-col'>
                                                            <span className='text-lg font-serif font-semibold'>{recentLeads[propIndex].noOfVehicle} <span className='text-sm'>Vehicle</span></span>
                                                            <span className='text-sm font-serif text-black/60'>Parking</span>
                                                        </div>
                                                    </div>
                                            )}
                                            {recentLeads[propIndex].furnished && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiWoodBeam size={25} />
                                                        <span className='font-serif font-semibold'>Furnished</span>
                                                    </div>
                                            )}
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHammer size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{recentLeads[propIndex].builtDate}</span>
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
                                                {recentLeads[propIndex].amenities[0].swimmingPool && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaSwimmingPool size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Swimming Pool</span>
                                                    </div>
                                                )}
                                                {recentLeads[propIndex].amenities[0].elevator && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiElevator size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Elevator</span>
                                                    </div>
                                                )}
                                                {recentLeads[propIndex].amenities[0].security && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaHouseLock size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Security</span>
                                                    </div>
                                                )}
                                                {recentLeads[propIndex].amenities[0].garden && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <PiPark size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Garden</span>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>                                             
                                </Accordion>
                                <Accordion className='mx-4 mb-28' allowToggle>
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
                                        <AccordionPanel className='text-balance font-serif' pb={4}>{recentLeads[propIndex].description}</AccordionPanel>
                                    </AccordionItem>                                             
                                </Accordion>
                            </div>
                        </ModalBody>
                        <MyFooter/>
                    </ModalContent>
                </Modal>}
            </div>
            <p className="m-3 text-red-600 text-sm">{error}</p>
        </div>
        <MyFooter/>
      
    </div>
  )
}
