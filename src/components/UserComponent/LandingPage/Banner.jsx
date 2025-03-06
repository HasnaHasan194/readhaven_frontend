import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookBannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const slides = [
    {
      image: "/a colorful and stylish banner for an e-commerce book website named READ HAVEN, with full-width nude shades and attractive book pictures, without a Shop Now option.png",
      quote: "Every book is a new journey waiting to unfold.",
  
    },
    {
      image: "https://i.etsystatic.com/16154027/r/il/dde9e4/3669738953/il_fullxfull.3669738953_iquq.jpg",
      quote: "Reading is an escape, an adventure, a friendship.",
      
    },
    {
      image: "https://wallpaperaccess.com/full/1209397.jpg",
      quote: "Books are a uniquely portable magic.",
      
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Images */}
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover absolute"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        {/* Quote Section */}
        <div className="max-w-2xl mb-8 px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            {slides[currentSlide].quote}
          </h2>
          <p className="text-xl md:text-2xl opacity-80 animate-fade-in-delay">
            {slides[currentSlide].author}
          </p>
        </div>

        {/* Explore Button */}
        <button  onClick={() => navigate("/shop-all")} className="bg-white text-black px-8 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors group">
          <ShoppingBag className="group-hover:scale-110 transition-transform" />
          <span>Explore Our Collection</span>
        </button>

        {/* Carousel Navigation */}
        <div className="absolute bottom-10 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        
        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default BookBannerCarousel;