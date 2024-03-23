import React,{ useState } from 'react'
import { app } from '../firebase'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import Header from '../components/Header'
import MyFooter from '../components/MyFooter'
import { FooterDivider } from 'flowbite-react';

export default function Sell() {

    const [maxDate, setMaxDate] = useState(getTodayDate());
    const [show,setShow] = useState(false);
    const [showList,setShowList] = useState(false);
    const [showFileInput, setShowFileInput] = useState(false);
    const [files,setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState("");
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgCount,setImgCount] = useState(0);

    const List = {
        state:"",
        city:""
    };

    const List1 = {
        propertyName: "",
        userContact: "",
        propertyType: "",
        description: "",
        address: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 220,
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

    const [amenitiesList,setAmenitiesList] = useState({
        parking:false,
        swimmingPool:false,
        elevator:false,
        security:false,
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

        categories.push('Cover image');

        if (formData.List1.amenities.swimmingPool) {
            categories.push('Swimming Pool');
        }
        if (formData.List1.amenities.parking) {
            categories.push('Parking');
        }
        if (formData.List1.amenities.security) {
            categories.push('Security');
        }
        if (formData.List1.amenities.elevator) {
            categories.push('Elevator');
        }

        // Add categories based on number of bedrooms and bathrooms
        for (let i = 1; i <= formData.List1.bedrooms; i++) {
            categories.push(`Bedroom ${i}`);
        }
        for (let i = 1; i <= formData.List1.bathrooms; i++) {
            categories.push(`Bathroom ${i}`);
        }

        // setImgCount(count);

        return categories;
    };
    
    const categories = getCategories();
    
    const handleCategoryChange = (e) => {
        setFormData({ ...formData, selectedCategory: e.target.value });
        setShowFileInput(true);
        setImageUploadError("");
        setUploading(false);
        console.log(formData.selectedCategory);
    };
    
    const handleFileChange = (e) => {
        setImageUploadError("");
        setUploading(true);
        const file = e.target.files[0];
        if(file){

            if(file.size > 3 * 1024 * 1024){
                setImageUploadError("File size exceeds 3MB limit");
                setFiles("");
                setUploading(true);
            }
            else{
                setFiles(file);
                setFormData({ ...formData, selectedFile: file });
                setUploading(false);
            }
        }
        else{
            setImageUploadError("please select image first!!!");
            setUploading(true);
        }
        setShowFileInput(false);
    };

    const handleImageUpload = async() => {
        if (formData.selectedCategory && formData.selectedFile) {
            setUploading(false);
            
            const newImage = {
                category: formData.selectedCategory,
                url: URL.createObjectURL(formData.selectedFile),
                name: formData.selectedFile.name
            };
            
            const existingIndex = formData.List1.images.findIndex(image => image.category === formData.selectedCategory);
            const imageExist = formData.List1.images.findIndex(image => image.name === formData.selectedFile.name);
    
            if(imageExist !== -1){
                setImageUploadError("Can't upload same image!!!");
                setUploading(true);
            }
            else{
                if (existingIndex !== -1) {
                    const updatedImages = [...formData.List1.images];
                    if(formData.selectedFile.name === updatedImages[existingIndex].name){
                        setImageUploadError("Image already uploaded!!!");
                        setUploading(true);
                    }
                    else{

                        updatedImages[existingIndex] = newImage;
                        try{    
                            await (storeImage(files));
                            setFormData({
                                ...formData,
                                List1: {
                                    ...formData.List1,
                                    images: updatedImages
                                },        
                            });
                            setImageUploadError("");
                            setUploading(false);
                        }catch(err){
                            setImageUploadError(err);
                            setUploading(false);
                        };
                    }
                }else {
                    try{
                        await storeImage(files);    
                        setFormData({
                            ...formData,
                            List1: {
                                ...formData.List1,
                                images: [...formData.List1.images, newImage]
                            },    
                        });
                        setImageUploadError("");
                        setUploading(false);
                    }catch(err){
                        setImageUploadError(err);
                        setUploading(false);
                    };
                }
            }
        }
        else{
            if(!formData.selectedCategory)
                setImageUploadError("please select category first!!!");
            else
                setImageUploadError("please select image first!!!");
            setUploading(false);
        }
    };
    
    const storeImage = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
        });

    };

    const handleRemoveUpload = (key) => {
        const updatedImages = formData.List1.images.filter((image, index) => index !== key);
        setFormData({
            ...formData, 
            List1: { ...formData.List1, images: updatedImages },
        });
        console.log(formData.List1.images);
    }

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
        if(e<formData.List1.bedrooms){
            const key = formData.List1.bedrooms;
            const updatedImages = formData.List1.images.filter((image, index) => index !== key);
            setFormData({...formData, List1:{...formData.List1,bedrooms:e,images:updatedImages},selectedCategory:'',selectedFile:null});
        }
        else
            setFormData({...formData, List1:{...formData.List1,bedrooms:e}});
        console.log(formData.List1);
    }

    const handleBathroomsChange = (e) => {
        if(e<formData.List1.bathrooms){
            const key = formData.List1.bathrooms;
            const updatedImages = formData.List1.images.filter((image, index) => index !== key);
            setFormData({...formData, List1:{...formData.List1,bathrooms:e,images:updatedImages},selectedCategory:'',selectedFile:null});
        }
        else
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
            setFormData({ ...formData, List1: { ...formData.List1, [name]: checked } });
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

    const handleImageClick = (imageUrl) => {
        console.log("Image clicked:", imageUrl);
        setSelectedImage(imageUrl);
    };
    
    const handleAddAmenities = () => {
        console.log(amenitiesList);
        setFormData(({
            ...formData,
            List1: {
                ...formData.List1,
                amenities: {
                    parking: amenitiesList.parking,
                    swimmingPool: amenitiesList.swimmingPool,
                    elevator: amenitiesList.elevator,
                    security: amenitiesList.security
                }
            },
            selectedCategory:'Cover'
        }));

        const { swimmingPool, parking, elevator, security } = amenitiesList;

        if (swimmingPool || parking || elevator || security)
            setShowList(true);
        else
            setShowList(false);
        setShow(false);
    }

    const handleChangeAmenities = (e) => {
        const {name,checked}= e.target;
        setAmenitiesList({...amenitiesList,[name]:checked});
        setFormData({...formData,selectedCategory:name});
        console.log(amenitiesList);
    }

    const handleRemoveAmenities = (key) => {
        console.log(key);
        var name = null;
        if(key === 'swimmingPool')
            name="Swimming Pool";
        else if(key === 'elevator')
            name="Elevator";
        else if(key === 'Security')
            name="Security";
        else
            name="Parking";

        const updatedImages = formData.List1.images.filter((image, index) => image.category !== name);
        setFormData({ ...formData, List1: { ...formData.List1, amenities: { ...formData.List1.amenities, [key]: false }, images:updatedImages},selectedCategory:'' });
        console.log(formData.List1.amenities);
    }
    
    const isClicked = () => {
        console.log(formData.List1.amenities);
        setShowList(false);
        setShow(true);
    }

    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        var count = 0;
        if (formData.List1.amenities.swimmingPool) {
            count=count+1;
        }
        if (formData.List1.amenities.parking) {
            count=count+1;
        }
        if (formData.List1.amenities.security) {
            count=count+1;
        }
        if (formData.List1.amenities.elevator) {
            count=count+1;
        }
        count=count+formData.List1.bathrooms+formData.List1.bedrooms;
        setImgCount(count);

        if(formData.List1.images.length<imgCount)
            setError("Upload all the images!!!");
        console.log(formData);
    };

  return (
    <>
        <Header/>

        <div className="flex justify-left items-center bg-cover bg-no-repeat bg-[url('./src/background1.jpeg')]">
            <div className="w-2/4 m-8 p-8 h-auto bg-white bg-opacity-50 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-4">Create Listing</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">property-name</label>
                            <input type="text" id="propertyName" name="propertyName" required onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                        </div>
                        <div>
                            <label htmlFor="userConatact" className="block text-sm font-medium text-gray-700">Contact No.</label>
                            <input type="number" id="userContact" name="userContact" required onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                        </div>
                    </div>

                    <div className="my-4">
                        <div className="h-px bg-white dark:bg-gray-700" />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property-type</label>
                            <select id="propertyType" name="propertyType" required onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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

                    <div className="my-4">
                        <div className="h-px bg-white dark:bg-gray-700" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea placeholder='enter property area description' required id="description" name="description" onChange={handleChange} className="mt-1 focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full h-auto min-h-10 shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"/>
                    </div>

                    <div className="my-4">
                        <div className="h-px bg-white dark:bg-gray-700" />
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

                    <div className="my-4">
                        <div className="h-px bg-white dark:bg-gray-700" />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4" >
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">address</label>
                            <textarea placeholder='enter property address' required id="address" name="address" onChange={handleChange} className="my-1 h-full focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full min-h-10 shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"/>
                        </div>

                        <div className='flex flex-col'>
                            <div className="mb-4">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <select id="country" name="country" required  onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="Country">--Select Country--</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <select id="state" name="state" required defaultChecked="default" onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option key="default" value="">--Select State--</option>
                                {stateOptions[formData.country]?.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <select id="city" name="city" required defaultChecked='default' onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option key='deafult' value="">--Select City--</option>
                                {cityOptions[formData.List.state]?.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    <FooterDivider className='my-4'/>

                    <div className="mb-4">
                        <label htmlFor="builtDate" className="block text-sm font-medium text-gray-700">Built Date</label>
                        <input type="date" id="builtDate" required name="builtDate" max={maxDate} onChange={handleChange} className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-auto shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" />
                    </div>

                    <FooterDivider className='my-4'/>

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
                            <NumberInput onChange={handleAreaChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" min={220} precision={3} step={0.001}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                        </div>
                    </div>
                    
                    <FooterDivider/>

                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    {show ? <></>: <button onClick={isClicked} className='my-2 p-2 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 hover:bg-gray-200'>--amenities--</button>}
                    {show ? 
                        <>
                            <div className="grid grid-cols-3 gap-3">
                                <div> 
                                    <input type="checkbox" required id="swimmingPool" name="swimmingPool"  onChange={handleChangeAmenities} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                    <label htmlFor="swimmingPool" className="m-2 text-gray-700">Swimming Pool</label>
                                </div>
                                <div>
                                    <input type="checkbox" required id="parking" name="parking"  onChange={handleChangeAmenities} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                    <label htmlFor="parking" className="m-2 text-gray-700">Parking</label>
                                </div>
                                <div>
                                    <input type="checkbox" required id="elevator" name="elevator"  onChange={handleChangeAmenities} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                    <label htmlFor="elevator" className="m-2 text-gray-700">Elevator</label>
                                </div>
                                <div>
                                    <input type="checkbox" required id="security" name="security"  onChange={handleChangeAmenities} className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                                    <label htmlFor="security"  className="m-2 text-gray-700">Security</label>
                                </div>


                                {amenitiesList.parking && (
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
                            <button onClick={handleAddAmenities} className='my-2 p-2 focus:ring-indigo-500 text-white focus:border-indigo-500 block shadow-sm sm:text-sm bg-black hover:opacity-85 opacity-70 rounded-md'>Add amenities</button>
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
                                                <button id={key + "remove"} name={key + "remove"} onClick={()=> handleRemoveAmenities(key)} className='w-fit bg-black opacity-75 hover:opacity-60 text-white rounded-md ml-1 p-1'>remove</button>
                                            </div>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div> 
                        : 
                        <></>}

                    <FooterDivider/>

                    <div className="mb-4">
                        <label htmlFor="offer" className="block text-sm font-medium text-gray-700">Offer</label>
                        <input type="checkbox" required id="offer" name="offer" onChange={handleChange} className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-50" />
                    </div>

                    <FooterDivider/>

                    <div className='mb-2'>
                        <label className="block text-sm font-medium text-gray-700">Upload images (*first option is for cover image)</label>
                        <select name="imageCategory" onChange={handleCategoryChange} value={formData.selectedCategory} className='mt-1 block w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                            <option value="">Select image Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <div className="my-2">
                            <div className="h-px w-3/5 bg-white opacity-70 dark:bg-gray-700" />
                        </div>
                    
                        <div className='flex flex-row items-center w-3/5'>
                            <input type="file" onChange={handleFileChange} accept='image/*' className='mt-2 p-1 rounded-lg'/>
                            <button type="button" onClick={handleImageUpload} disabled={uploading} className='w-fit bg-black hover:opacity-90 opacity-70 text-white rounded-md ml-1 px-2 py-1'>Upload</button>
                        </div>

                        <p className='m-3 text-red-600 text-sm'>{imageUploadError}</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Uploaded images</label>
                            <div className='grid grid-cols-3 items-center'>
                                {formData.List1.images.map((image, index) => (
                                    <div key={index} className='grid grid-flow-row items-center m-1 border-black/35 border-spacing-1 border-2 rounded-md'>
                                        <div className='flex flex-col items-center justify-evenly p-1'>  
                                            <div>{image.category}</div>
                                            <div className="relative group" onClick={() => handleImageClick(image.url)}>
                                                <img src={image.url} alt={image.category} className="w-30 h-20 object-contain rounded-lg cursor-pointer" />
                                            </div>
                                            {selectedImage && (
                                                <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent" onClick={() => setSelectedImage("")}>
                                                    <img src={selectedImage} alt="Selected Image" className="w-4/5 h-3/4 bg-black/10 p-3" />
                                                </div>
                                            )} 
                                        </div>
                                        <div className='grid justify-center py-1'>
                                            <button id={index + "remove"} name={index + "remove"} onClick={()=> handleRemoveUpload(index)} className='w-fit bg-black opacity-75 hover:opacity-60 text-white rounded-md ml-1 p-1'>remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <FooterDivider/>

                    <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none focus:shadow-outline">List property</button>
                    <p className='m-1 text-red-600 text-sm'>{error}</p>
                </form>

            </div>  
        </div>
        <MyFooter/>
    </>
  )
}
