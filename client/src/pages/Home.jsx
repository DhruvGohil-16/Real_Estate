import React,{useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaHome, FaHammer, FaSwimmingPool} from "react-icons/fa";
import { FaLocationDot,FaHouseLock } from "react-icons/fa6";
import { TbRulerMeasure, TbReceiptTax } from "react-icons/tb";
import { PiPark } from "react-icons/pi";
import { MdAddHomeWork } from "react-icons/md";
import { GiElevator, GiHomeGarage, GiWoodBeam } from "react-icons/gi";
import { Tabs, TabList, TabPanels, Tab, TabPanel,Modal, Button,useDisclosure,
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
   } from '@chakra-ui/react'
import MyFooter from '../components/MyFooter';
import ContactUs from './ContactUs';
import ImageSlider from '../components/ImageSlider';

export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIndex,setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [properties,setProperties] = useState([]);
  const [property,setProperty] = useState([]);
  const [propIndex, setPropIndex] = useState(0);
  const { currentUser} = useSelector((state) => state.user);

  const handleIndexClick = (index) => {
    setPropIndex(index);
    setProperty(properties);
    onOpen();
}
  
  const images = [
    {
      url: './src/img3.jpg',
    },
    {
      url: './src/img4.jpg',
    },
    {
      url: './src/img5.jpg',
    },
    {
      url: './src/img6.jpg',
    },
    {
      url: './src/img8.jpg',
    },
  ];

  const fetchListedProperties = async () => {
    
    try {
        const response = await fetch('/api/listing/listedProp');
        const Data = await response.json();
        
        if (Data.success === false)
            console.log(Data.message);
        else{
            console.log(Data);
            setProperties(Data.listing);
        }
    } catch (error) {
        console.log(error);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchListedProperties();
    setProperty([]);
  }, []);

  return (
    <div>
      
      <div className='flex flex-col'>
        <div id="home" className="relative bg-cover bg-center pb-24 h-96">
          <img className='absolute w-full h-full' src={images[currentIndex].url} alt={`Image ${currentIndex}`} />
          <div className="mx-auto pt-4 h-full flex flex-col relative z-10 justify-center items-center text-center">
            <h1 className="text-5xl md:text-6xl text-white font-bold font-serif leading-tight mb-4 text-center"><span className='block'>The #1 site real estate </span><span>professionals trust*</span></h1>
            <p className="text-xl font-serif text-white mb-8">Find your dream home with us</p>
            <div className='flex flex-row gap-10'>
              <Link to='/buy'><div className='p-4 py-6 ty:hidden mdl:inline font-serif text-lg text-white hover:border-b-4 hover:border-b-white hover:text-slate-200  cursor-pointer'>Buy</div></Link>
              <Link to='/sell'><div className='p-4 py-6 ty:hidden  mdl:inline font-serif text-lg text-white hover:border-b-4 hover:border-b-white hover:text-slate-200 cursor-pointer'>Sell</div></Link>
              <Link to='/your-property'><div className='p-4 py-6 ty:hidden mdl:inline font-serif text-lg text-white hover:border-b-4 hover:border-b-white hover:text-slate-200 cursor-pointer'>Your Property</div></Link>
            </div>
          </div>
        </div>

        <div id="properties" className=" relative py-16 mb-2 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent opacity-75"></div>
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold font-serif relative z-10 text-center mb-8">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property,index) => (
                  <div key={property.propertyId} onClick={()=>handleIndexClick(index)} 
                    className="group bg-slate-100 rounded-lg overflow-hidden shadow-xl cursor-pointer relative">
                    <img src={property.images[0]} alt={property.propertyName} className="w-full h-64 object-cover object-center transition duration-300 ease-in-out transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
                    <div className="absolute inset-0 flex dark:text-white text-black items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                      <div className="flex flex-col w-full items-center m-4 font-serif text-white">
                        <h3 className="text-xl w-full text-left font-semibold mb-2">{property.propertyName}</h3>
                        <div className='flex flex-row gap-1 w-full'>
                          <div className="text-md font-semibold mb-2">{property. city} -</div>
                          <div className="text-md font-semibold mb-2">{property. state} -</div>
                          <div className="text-md font-semibold mb-2">{property. country}</div>
                        </div>
                        <p className="text-gray-200 w-full text-left font-serif overflow-hidden line-clamp-3 text-ellipsis">{property.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                { property[propIndex] && <Modal isOpen={isOpen} size='full' onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontFamily='serif' fontSize={32} textTransform='uppercase' textAlign='left' >{property[propIndex].propertyName}</ModalHeader>
                        <ModalCloseButton  />
                        <ModalBody>
                            <div>
                                <ImageSlider images={property[propIndex].images} />
                                <div className='grid grid-flow-row gap-2 m-4'>
                                    {property[propIndex].offer && (
                                        <div className='flex flex-row gap-2'>
                                            <div className="text-black text-2xl line-through font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property[propIndex].price)}</div>
                                            <div className='text-black text-3xl font-semibold font-serif'>₹{Intl.NumberFormat('en-IN').format(property[propIndex].discountPrice)}</div>
                                        </div>
                                    )}
                                    {!property[propIndex].offer && (
                                        <div className="text-black text-3xl font-semibold font-serif">₹{Intl.NumberFormat('en-IN').format(property[propIndex].price)}</div>
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
                                        <div className="text-black "><span className='font-bold'>{Intl.NumberFormat('en-IN').format(property[propIndex].bedrooms)}</span> bed</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(property[propIndex].bathrooms)}</span> bath</div>
                                        <div className="text-black"><span className='font-bold'>{Intl.NumberFormat('en-IN').format(property[propIndex].sqarea)}</span> sqft</div>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center mb-4 pb-2 border-solid border-black border-b-2'>
                                        <FaLocationDot size={25} />
                                        <p className="text-black/80 text-balance font-serif text-lg ">{property[propIndex].address}</p>                                                              
                                    </div>
                                    <div className='w-3/5 mb-5'>
                                        <div className='grid grid-cols-3 gap-y-10'>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHome size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{property[propIndex].propertyType}</span>
                                                    <span className='text-sm font-serif text-black/60'>Property type</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <TbRulerMeasure size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>₹ {Intl.NumberFormat('en-IN').format((property[propIndex].price)/(property[propIndex].sqarea))}</span>
                                                    <span className='text-sm font-serif text-black/60'>Price per sqft</span>
                                                </div>
                                            </div>
                                            {property[propIndex].amenities[0].parking && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiHomeGarage size={25} />
                                                        <div className='flex flex-col'>
                                                            <span className='text-lg font-serif font-semibold'>{property[propIndex].noOfVehicle} <span className='text-sm'>Vehicle</span></span>
                                                            <span className='text-sm font-serif text-black/60'>Parking</span>
                                                        </div>
                                                    </div>
                                            )}
                                            {property[propIndex].furnished && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiWoodBeam size={25} />
                                                        <span className='font-serif font-semibold'>Furnished</span>
                                                    </div>
                                            )}
                                            <div className='flex flex-row gap-3 items-center'>
                                                <FaHammer size={25} />
                                                <div className='flex flex-col'>
                                                    <span className='font-serif font-semibold'>{property[propIndex].builtDate}</span>
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
                                                {property[propIndex].amenities[0].swimmingPool && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaSwimmingPool size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Swimming Pool</span>
                                                    </div>
                                                )}
                                                {property[propIndex].amenities[0].elevator && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <GiElevator size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Elevator</span>
                                                    </div>
                                                )}
                                                {property[propIndex].amenities[0].security && (
                                                    <div className='flex flex-row gap-3 items-center'>
                                                        <FaHouseLock size={25} />
                                                        <span className='text-sm font-serif text-black/60'>Security</span>
                                                    </div>
                                                )}
                                                {property[propIndex].amenities[0].garden && (
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
                                        <AccordionPanel className='text-balance font-serif' pb={4}>{property[propIndex].description}</AccordionPanel>
                                    </AccordionItem>                                       
                                </Accordion>
                            </div>
                        </ModalBody>
                        <MyFooter/>
                    </ModalContent>
                </Modal>}
              </div>
            </div>
        </div>

        <ContactUs/>

        <MyFooter/>
  
      </div>
    </div>
  )
}
