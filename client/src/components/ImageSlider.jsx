import React, { useState } from 'react';
import {useSwipeable} from 'react-swipeable';

const ImageSlider = ({ images }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(images.length-1);
    const [nextIndex, setNextIndex] = useState(1);

    const Swipeable = useSwipeable({
        onSwipedLeft: () => {
                if (currentIndex < images.length - 1)
                    setCurrentIndex(currentIndex + 1);
                else
                    setCurrentIndex(0);

                if (prevIndex < images.length - 1)
                    setPrevIndex(prevIndex + 1);
                else
                    setPrevIndex(0);

                if (nextIndex < images.length - 1)
                    setNextIndex(nextIndex + 1);
                else
                    setNextIndex(0);
            },
        onSwipedRight: () => {
                if (currentIndex > 0)
                    setCurrentIndex(currentIndex - 1);
                else
                    setCurrentIndex(images.length -1);

                if (prevIndex > 0)
                    setPrevIndex(prevIndex - 1);
                else
                    setPrevIndex(images.length -1);

                if (nextIndex > 0)
                    setNextIndex(nextIndex - 1);
                else
                    setNextIndex(images.length -1);
            },
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    });


    const handleLeft = () => {
        if (currentIndex > 0) 
            setCurrentIndex(currentIndex - 1);
        else
            setCurrentIndex(images.length - 1);
        
        if (prevIndex > 0) 
            setPrevIndex(prevIndex - 1);
        else
            setPrevIndex(images.length - 1);

        if (nextIndex > 0) 
            setNextIndex(nextIndex - 1);
        else
            setNextIndex(images.length - 1);
};

const handleRight = () => {
        if (currentIndex < images.length - 1)
            setCurrentIndex(currentIndex + 1);
        else
            setCurrentIndex(0);

        if (prevIndex < images.length - 1)
            setPrevIndex(prevIndex + 1);
        else
            setPrevIndex(0);

        if (nextIndex < images.length - 1)
            setNextIndex(nextIndex + 1);
        else
            setNextIndex(0);
    };

  return (
    
        <div className='mx-4 mt-4 mb-10 '>
            <div className='grid grid-cols-4 gap-1 items-center'>
                <div className='grid col-span-3'>
                    <div className='grid grid-flow-row items-center'>
                        <img {...Swipeable} src={images[currentIndex].url} alt={images[currentIndex].name} className='h-96 rounded-tl-lg border-solid border-2 border-black'/>
                        <div className='grid grid-flow-col items-center rounded-bl-lg border-solid border-l-2 border-b-2 border-r-2 border-black'>
                            <div className='grid justify-end m-2'>
                                <button className="w-fit bg-gray-800 text-white px-3 py-1 rounded" onClick={handleLeft}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className='grid justify-center'>
                                <p className="text-center w-25 font-semibold font-serif">{images[currentIndex].category}</p>
                            </div>
                            <div>
                                <button className="w-fit bg-gray-800 text-white px-3 py-1 rounded" onClick={handleRight}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-full'>
                    <div className='grid grid-rows-3 gap-px h-full'>
                        <div>
                            <img src={images[prevIndex].url} onClick={handleLeft} alt={images[prevIndex].name} className='h-full rounded-tr-lg border-solid border-2 border-black/40 cursor-pointer'/>
                            <p className="text-center -mt-6 font-semibold font-serif">{images[prevIndex].category}</p>
                        </div>
                        <div>
                            <img src={images[currentIndex].url} alt={images[currentIndex].name} className='h-full  border-solid border-2 border-black'/>
                            <p className="text-center -mt-6 font-semibold font-serif">{images[currentIndex].category}</p>
                        </div>
                        <div>
                            <img src={images[nextIndex].url} onClick={handleRight} alt={images[nextIndex].name} className='h-full rounded-br-lg border-solid border-2 border-black/40 cursor-pointer'/>
                            <p className="text-center -mt-6 font-semibold font-serif">{images[nextIndex].category}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    

  );
};

export default ImageSlider;
