import React,{useEffect,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import Header from '../components/Header';
import MyFooter from '../components/MyFooter';
import ContactUs from './ContactUs';

export default function Home() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties,setProperties] = useState([]);
  const { currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  
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
      url: './src/img7.jpg',
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
            setProperties(Data.data);
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
              <Link to='/rent'><div className='p-4 py-6 ty:hidden mdl:inline font-serif text-lg text-white hover:border-b-4 hover:border-b-white hover:text-slate-200 cursor-pointer'>Rent</div></Link>
            </div>
          </div>
        </div>

        <div id="properties" className=" relative py-16 mb-2 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent opacity-75"></div>
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold font-serif relative z-10 text-center mb-8">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property,index) => (
                  <div key={property.propertyId} onClick={()=>{navigate('/buy')}} 
                    className="group bg-slate-100 rounded-lg overflow-hidden shadow-xl cursor-pointer relative">
                    <img src={property.images[0]} alt={property.propertyName} className="w-full h-64 object-cover object-center transition duration-300 ease-in-out transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
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
              </div>
            </div>
        </div>

        <ContactUs/>

        <MyFooter/>
  
      </div>
    </div>
  )
}
