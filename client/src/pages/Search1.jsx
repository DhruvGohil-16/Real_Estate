import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaSearch,FaHome, FaHammer, FaSwimmingPool} from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { FaLocationDot,FaHouseLock } from "react-icons/fa6";
import { TbRulerMeasure, TbReceiptTax } from "react-icons/tb";
import { PiPark } from "react-icons/pi";
import { MdAddHomeWork } from "react-icons/md";
import { GiElevator, GiHomeGarage, GiWoodBeam } from "react-icons/gi";
import { Modal, Button,useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
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
import ImageSlider from '../components/ImageSlider';

export default function Search1() {

    const [listedProperties, setListedProperties] = useState([]);
    const [loading,setLoading] = useState(false);
    const [propIndex, setPropIndex] = useState(0);
    const [property,setProperty] = useState([]);
    const [error, setError] = useState("");
    const [searchbardata, setSearchbardata] = useState({
        searchTerm: '',
        propertyType: '',
        country:'',
        state:'',
        city:'',
        swimmingPool:false,
        elevator:false,
        garden:false,
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });
    const { currentUser} = useSelector((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const countryOption = ['India','USA'];

    const stateOptions = ['Gujarat', 'Maharashtra', 'Delhi','New York', 'California', 'Texas'];
    
    const cityOptions = ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Bhavnagar','Mumbai', 'Pune',
     'Nagpur', 'Nashik', 'Aurangabad','New Delhi', 'Gurgaon', 'Noida', 'Faridabad','New York City', 
     'Buffalo', 'Rochester', 'Albany','Los Angeles', 'San Francisco', 'San Diego', 'Sacramento',
     'Houston', 'Dallas', 'Austin', 'San Antonio'];

    const amenitiesOptions = ['garden', 'parking', 'elevator','swimmingPool'];

    const typeOptions =['Apartment', 'House', 'Condo','Townhouse'];

    const sortOptions = ['Price high to low','Price low to high','Latest','Oldest']

    const handleIndexClick = (index,flag) => {
        setPropIndex(index);
        if(flag===0)
            setProperty(listedProperties);
        else if(flag===1)
            setProperty(pendingProperties);
        else if(flag===2)
            setProperty(soldProperties);
        else
            setProperty(rejectedProperties);
        onOpen();
    }

    const handleCheckBox = (e) => {
        const sort = e.target.value.split('_')[0] || 'created_at';

        const order = e.target.value.split('_')[1] || 'desc';
  
        setSearchbardata({ ...searchbardata, sort, order });    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', searchbardata.searchTerm);
        urlParams.set('propertyType', searchbardata.propertyType);
        urlParams.set('country', searchbardata.country);
        urlParams.set('state', searchbardata.state);
        urlParams.set('city', searchbardata.city);
        urlParams.set('parking', searchbardata.parking);
        urlParams.set('garden', searchbardata.garden);
        urlParams.set('swimmingPool', searchbardata.swimmingPool);
        urlParams.set('elevator', searchbardata.elevator);
        urlParams.set('furnished', searchbardata.furnished);
        urlParams.set('offer', searchbardata.offer);
        urlParams.set('sort', searchbardata.sort);
        urlParams.set('order', searchbardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const propertyTypeFromUrl = urlParams.get('propertyType');
        const countryFromUrl = urlParams.get('country');
        const stateFromUrl = urlParams.get('state');
        const cityFromUrl = urlParams.get('city');
        const parkingFromUrl = urlParams.get('parking');
        const gardenFromUrl = urlParams.get('garden');
        const swimmingPoolFromUrl = urlParams.get('swimmingPool');
        const elevatorFromUrl = urlParams.get('elevator');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl || propertyTypeFromUrl ||
            countryFromUrl || stateFromUrl || cityFromUrl ||
            parkingFromUrl || gardenFromUrl || elevatorFromUrl || swimmingPoolFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
          ) {
            setSearchbardata({
              searchTerm: searchTermFromUrl || '',
              propertyType: propertyTypeFromUrl || '',
              country: countryFromUrl || '',
              state: stateFromUrl || '',
              city: cityFromUrl || '',
              parking: parkingFromUrl === 'true' ? true : false,
              elevator: elevatorFromUrl === 'true' ? true : false,
              garden: gardenFromUrl === 'true' ? true : false,
              swimmingPool: swimmingPoolFromUrl === 'true' ? true : false,
              furnished: furnishedFromUrl === 'true' ? true : false,
              offer: offerFromUrl === 'true' ? true : false,
              sort: sortFromUrl || 'created_at',
              order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/listedProp?${searchQuery}`);
            const data = await res.json();
            
            setListedProperties(data.listing);
            setLoading(false);
        };

        fetchListings();

  }, [location.search]);

  return (
    <div>
      <div className='flex flex-col'>
        <div className='bg-gray-400'>
            <form onSubmit={handleSubmit}>
                <div className='flex items-center m-4 gap-2 border-black/50 border-2 p-3 rounded-md'>
                    <div className='bg-slate-200 flex items-center p-3 rounded-full border font-serif border-amber-100 hover:shadow-lg hover:border-blue-400'>
                        <input className='bg-transparent font-serif placeholder-slate-500 focus:outline-none ty:w-32 df:w-36 ds:w-44 smd0:w-56 smd:w-64 mdl:w-80' autoComplete='off'
                        type='text' 
                        name='searchbar'
                        id='searchbar'
                        placeholder='Address, City, Zip Code or Neighborhood....'
                        onChange={(e)=> setSearchbardata({...searchbardata,searchTerm:e.target.value})}
                        value={searchbardata.searchTerm}/>

                        <button type='submit' name='search' id='search'>
                            <FaSearch className='text-black/80 flex cursor-pointer'/>
                        </button>
                    </div>
                    <select className='bg-gray-200 w-28 border border-gray-200 text-gray-700 p-2  rounded-xl font-serif leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-transform duration-500' value={searchbardata.country} onChange={(e) => setSearchbardata({...searchbardata,country:e.target.value})}>
                        <option value="">-Country-</option>
                        {countryOption.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                        ))}
                    </select>
                    <select className='bg-gray-200 w-24 border border-gray-200 text-gray-700 p-2  rounded-xl font-serif leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-500' value={searchbardata.state} onChange={(e) => setSearchbardata({...searchbardata,state:e.target.value})}>
                        <option value="">-State-</option>
                        {stateOptions.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                        ))}
                    </select>
                    <select className='bg-gray-200 w-20 border border-gray-200 text-gray-700 p-2  rounded-xl font-serif leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-500' value={searchbardata.city} onChange={(e) => setSearchbardata({...searchbardata,city:e.target.value})}>
                        <option value="">-City-</option>
                        {cityOptions.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                        ))}
                    </select>            
                    <select className='bg-gray-200 w-20 border border-gray-200 text-gray-700 p-2  rounded-xl font-serif leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-500' value={searchbardata.propertyType} onChange={(e) => setSearchbardata({...searchbardata,propertyType:e.target.value})}>
                        <option value="">-Type-</option>
                        {typeOptions.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                        ))}
                    </select>            
                    <select defaultValue={'created_at_desc'} className='bg-gray-200 w-32 border border-gray-200 text-gray-700 p-2  rounded-xl font-serif leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-500' onChange={handleCheckBox}>
                        
                        <option key={sortOptions[0]} value='price_desc'>
                            {sortOptions[0]}
                        </option>
                        <option key={sortOptions[1]} value='price_asc'>
                            {sortOptions[1]}
                        </option>
                        <option key={sortOptions[2]} value='createdAt_desc'>
                            {sortOptions[2]}
                        </option>
                        <option key={sortOptions[3]} value='createdAt_asc'>
                            {sortOptions[3]}
                        </option>
                
                    </select>
                    <Popover>
                        <PopoverTrigger>
                            <Button fontFamily='serif' fontSize='larger' backgroundColor='gray.200' rounded='xl'>Options</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader fontFamily='serif'>Search property options </PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                                <div className='flex flex-col gap-1 m-2 font-serif'>
                                    <div className='flex items-center gap-1'>
                                        <input id='offer' type='checkbox' checked={searchbardata.offer} onChange={(e)=>setSearchbardata({...searchbardata,offer:e.target.checked})}/>
                                        <span>offer</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <input id={amenitiesOptions[0]} type='checkbox' checked={searchbardata.garden} onChange={(e)=>setSearchbardata({...searchbardata,garden:e.target.checked})}/>
                                        <span>{amenitiesOptions[0]}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <input id={amenitiesOptions[1]} type='checkbox' checked={searchbardata.parking} onChange={(e)=>setSearchbardata({...searchbardata,parking:e.target.checked})}/>
                                        <span>{amenitiesOptions[1]}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <input id={amenitiesOptions[2]} type='checkbox' checked={searchbardata.elevator} onChange={(e)=>setSearchbardata({...searchbardata,elevator:e.target.checked})}/>
                                        <span>{amenitiesOptions[2]}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <input id={amenitiesOptions[3]} type='checkbox' checked={searchbardata.swimmingPool} onChange={(e)=>setSearchbardata({...searchbardata,swimmingPool:e.target.checked})}/>
                                        <span>{amenitiesOptions[3]}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <input id='furnished' type='checkbox' checked={searchbardata.furnished} onChange={(e)=>setSearchbardata({...searchbardata,furnished:e.target.checked})}/>
                                        <span>furnished</span>
                                    </div>
                                </div>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    
                </div>

            </form>
        </div>
        <div className='flex min-h-screen bg-gray-200 bg-gradient-to-b from-gray-400 to-transparent'>
            <div className="container mx-auto py-8 ">
                
                        {listedProperties.length ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {listedProperties.map((property,index) => (
                                        <div key={property._id} className="bg-slate-200 shadow-lg rounded-xl m-6">
                                            <img src={property.images[0].url} onClick={() => handleIndexClick(index,0)} alt={property.propertyName} className="w-full h-44 rounded-t-md mb-4 cursor-pointer" />
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
                                                        <Button colorScheme='teal' width='fit-content' fontFamily='serif' onClick={() => handleIndexClick(index,0)}>More Info</Button>
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
                { property[propIndex] && <Modal isOpen={isOpen} size='full' onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontFamily='serif' fontSize={32} textTransform='uppercase' textAlign='left' >{property[propIndex].propertyName}</ModalHeader>
                        <ModalCloseButton />
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
                                        <AccordionPanel className='text-balance font-serif' pb={4}>{property[propIndex].description}</AccordionPanel>
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
    </div>
  )
}
