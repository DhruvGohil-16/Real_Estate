import React,{ useState } from 'react'
import { useSelector } from 'react-redux'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import Header from '../components/Header'
import MyFooter from '../components/MyFooter'

export default function Sell() {

    const [maxDate, setMaxDate] = useState(getTodayDate());
    const [show,setShow] = useState(false);
    const [showList,setShowList] = useState(false);
    const { currentUser} = useSelector((state) => state.user);
    const [showFileInput, setShowFileInput] = useState(false);

    const List = {
        state:"",
        city:""
    };

    const List1 = {
        propertyName: "",
        user: "",
        propertyType: "",
        description: "",
        address: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 0.000,
        price: 0.00,
        discountPrice: 0.00,
        offer: false,
        saleType: "",
        images: [],
        amenities: {
            parking:false,
            swimmingPool: false,
            elevator: false,
            security: false
        },
        noOfVehicle: 0,
        builtDate: ""
    };

    const [formData, setFormData] = useState({
        List1,
        country:"",
        selectedCategory: '',
        selectedFile: null,
        List,
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
    const getCategories = () => {
        const categories = [];

        categories.push('cover image');
        if (formData.List1.amenities.swimmingPool) {
            categories.push('Swimming Pool');
        }
        if (formData.List1.amenities.parking) {
            categories.push('Parking');
        }
        if (formData.List1.amenities.security) {
            categories.push('Security');
        }

        // Add categories based on number of bedrooms and bathrooms
        for (let i = 1; i <= formData.List1.bedrooms; i++) {
            categories.push(`Bedroom ${i}`);
        }
        for (let i = 1; i <= formData.List1.bathrooms; i++) {
            categories.push(`Bathroom ${i}`);
        }

        return categories;
    };

    const handleCategoryChange = (e) => {
        setFormData({ ...formData, selectedCategory: e.target.value });
        setShowFileInput(true);
        console.log(formData.selectedCategory);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, selectedFile: e.target.files[0] });
        setShowFileInput(false);
        console.log(formData.selectedFile);
    };

    const handleUpload = () => {
        if (formData.selectedCategory && formData.selectedFile) {
            const newImage = {
                category: formData.selectedCategory,
                url: URL.createObjectURL(formData.selectedFile)
            };
    
            const existingIndex = formData.List1.images.findIndex(image => image.category === formData.selectedCategory);
    
            if (existingIndex !== -1) {
                const updatedImages = [...formData.List1.images];
                updatedImages[existingIndex] = newImage;
    
                setFormData({
                    ...formData,
                    List1: {
                        ...formData.List1,
                        images: updatedImages
                    },
                    selectedCategory: '',
                    selectedFile: null
                });
            } else {
                setFormData({
                    ...formData,
                    List1: {
                        ...formData.List1,
                        images: [...formData.List1.images, newImage]
                    },
                    selectedCategory: '',
                    selectedFile: null
                });
            }
        }
        console.log(formData.List1.images);
    };

    const handleImageChange = (name,val) => {    
        const category = name + val;
        if(formData.List1.images.some((image) => image.category === category)){
            const updatedImages = formData.List1.images.filter(image => image.category !== category);
            setFormData({...formData,List1: {
                    ...formData.List1,
                    images: updatedImages,
                }
            });
            console.log(formData.List1.images);
        }
        console.log(category);
    }
    
    const categories = getCategories();
    
    const handleAreaChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,area:e}});
        console.log(formData);
    }

    const handlePriceChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,price:e}});
        console.log(formData);
    }

    const handleDiscountPriceChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,discountPrice:e}});
        console.log(formData);
    }

    const handleBedroomsChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,bedrooms:e}});
        console.log(formData);
    }

    const handleBathroomsChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,bathrooms:e}});
        console.log(formData);
    }

    const handleVehicleChange = (e) => {
        setFormData({...formData, List1:{...formData.List1,noOfVehicle:e}});
        console.log(formData);
    }

    const handleChange = (e) => {
        const {  name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === "offer")
                setFormData({ ...formData, List1: { ...formData.List1, [name]: checked } });
            else
                setFormData({ ...formData, List1: { ...formData.List1, amenities: { ...formData.List1.amenities, [name]: checked } } });
        } else{       
            if (name === "country") {
                setFormData({ ...formData, country: value, List: { state: "", city: "" } });
            } else if (name === "state") {
                if(value !== '')
                    setFormData({ ...formData, List: { ...formData.List, state: value, } });
                else
                    setFormData({ ...formData, List: { ...formData.List, state: "State", } });
            } else if(name === "city"){
                if(value !== '')
                    setFormData({ ...formData, List: { ...formData.List, city: value } });
                else
                setFormData({ ...formData, List: { ...formData.List, city: "City" } });
            } else{
                setFormData({
                    ...formData,
                    [name]:value
                })
            }
        }
        console.log(formData);
    };

    const handleRemove = (key) => {
        setFormData({ ...formData, List1: { ...formData.List1, amenities: { ...formData.List1.amenities, [key]: false } } });
        console.log(formData.List1.amenities);
    }

    const isClicked = () => {
        setShowList(false);
        setShow(true);
    }

    const notShow = () => {
        if(formData.List1.amenities.swimmingPool || formData.List1.amenities.parking || formData.List1.amenities.elevator || formData.List1.amenities.security)
            setShowList(true);
        else
            setShowList(false);
        setShow(false);
        setFormData({...formData});
    }


    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
    };

  return (
    <>
        <Header/>

        <div className="flex justify-left items-center bg-cover bg-[url('./src/background.jpeg')]">
            <div className="w-2/4 m-8 p-8 bg-white bg-opacity-50 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Create Listing</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">property-name</label>
                        <input type="text" id="propertyName" name="propertyName" onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                    </div>
                    <div>
                        <label htmlFor="user" className="block text-sm font-medium text-gray-700">username</label>
                        <input type="text" id="user" name="user" defaultValue={currentUser.username} onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">property-type</label>
                        <select id="propertyType" name="propertyType"  onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select Property Type</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Land">Land</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea placeholder='enter property area description' id="description" name="description" onChange={handleChange} className="mt-1 focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full h-auto min-h-10 shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"/>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <NumberInput onChange={handlePriceChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={0} precision={2} step={0.01}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </div>
                <div>
                    <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
                    <NumberInput onChange={handleDiscountPriceChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={0} precision={2} step={0.01}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4" >
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">address</label>
                        <textarea placeholder='enter property address' id="address" name="address" onChange={handleChange} className="my-1 h-full focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full min-h-10 shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"/>
                    </div>

                    <div className='flex flex-col'>
                        <div className="mb-4">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <select id="country" name="country"  onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="Country">--Select Country--</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <select id="state" name="state" defaultChecked="default" onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option key="default" value="">--Select State--</option>
                            {stateOptions[formData.country]?.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <select id="city" name="city" defaultChecked='default' onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option key='deafult' value="">--Select City--</option>
                            {cityOptions[formData.List.state]?.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                            </select>
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                        <NumberInput onChange={handleBedroomsChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper onClick={() => handleImageChange("Bedroom ",(parseInt(formData.List1.bedrooms) + 1))}/>
                            </NumberInputStepper>
                        </NumberInput>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                        <NumberInput onChange={handleBathroomsChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper onClick={() => handleImageChange("Bathroom ",(parseInt(formData.List1.bathrooms) + 1))}/>
                            </NumberInputStepper>
                        </NumberInput>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area Sqft</label>
                        <NumberInput onChange={handleAreaChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={0} precision={3} step={0.001}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </div>
                </div>
                
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                {show ? <></>: <button onClick={isClicked} className='my-2 p-2 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 hover:bg-gray-200'>--amenities--</button>}
                {show ? 
                    <>
                        <div className="grid grid-cols-3 gap-3">
                            <div> 
                                <input type="checkbox" id="swimmingPool" name="swimmingPool"  onChange={handleChange} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                <label htmlFor="swimmingPool" className="m-2 text-gray-700">Swimming Pool</label>
                            </div>
                            <div>
                                <input type="checkbox" id="parking" name="parking"  onChange={handleChange} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                <label htmlFor="parking" className="m-2 text-gray-700">Parking</label>
                            </div>
                            <div>
                                <input type="checkbox" id="elevator" name="elevator"  onChange={handleChange} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                <label htmlFor="elevator" className="m-2 text-gray-700">Elevator</label>
                            </div>
                            <div>
                                <input type="checkbox" id="security" name="security"  onChange={handleChange} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                <label htmlFor="security" className="m-2 text-gray-700">Security</label>
                            </div>


                            {formData.List1.amenities.parking && (
                            <div className="mb-4">
                                <label htmlFor="noOfVehicle" className="block text-sm font-medium text-gray-700">No of Vehicle</label>
                                <NumberInput onChange={handleVehicleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={0}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>
                            </div>
                            )}
                        </div>
                        <button onClick={notShow} className='my-2 p-2 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 hover:bg-gray-200'>add amenities</button>
                    </>
                    :
                    <></>
                }

                {showList ? <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Selected Amenities</label>
                        <ul className="grid grid-cols-2 gap-3 m-2">
                            {Object.entries(formData.List1.amenities).map(([key, value]) => (
                                value && (
                                    <li key={key} className="grid grid-flow-col items-center">
                                        <div className='flex flex-row'>
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {key}
                                        </div>
                                        <div className="grid justify-end">
                                            <button id={key + "remove"} name={key + "remove"} onClick={()=> handleRemove(key)} className='w-fit bg-black opacity-80 text-white rounded-md ml-1 p-1'>remove</button>
                                        </div>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div> 
                    : 
                    <></>}


                <div className="mb-4">
                    <label htmlFor="offer" className="block text-sm font-medium text-gray-700">Offer</label>
                    <input type="checkbox" id="offer" name="offer" onChange={handleChange} className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                </div>

                <div className='mb-2'>
                    <label className="block text-sm font-medium text-gray-700">Upload images (*first option is for cover image)</label>
                    <select name="imageCategory" onChange={handleCategoryChange} className='mt-1 block w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                        <option value="">Select image Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                   
                    <div className='flex flex-row w-3/5'>
                        <input type="file" onChange={handleFileChange} className='mt-2 p-1'/>
                        <button type="button" onClick={handleUpload} className='w-fit bg-black opacity-70 text-white rounded-md ml-1 p-1'>Upload</button>
                    </div>
                    

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Uploaded images</label>
                        <div className='grid grid-cols-3'>
                            {formData.List1.images.map((image, index) => (
                                <div key={index} className='mt-1'>
                                    <p>Category: {image.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="mb-4">
                    <label htmlFor="builtDate" className="block text-sm font-medium text-gray-700">Built Date</label>
                    <input type="date" id="builtDate" name="builtDate" max={maxDate} onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-auto shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">List property</button>
            </form>

            </div>  
        </div>
        <MyFooter/>
    </>
  )
}
