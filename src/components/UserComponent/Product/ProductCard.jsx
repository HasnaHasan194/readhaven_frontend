import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const BookProductCard = ({
    name,
    rating,
    price,
    image,
    author,
    availability
}) => {
  const [isHovered, setIsHovered] = useState(false);

 

  return (
    <div 
      className="group relative w-72 bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Subtle Zoom */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-80 object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Wishlist Icon */}
        <button className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white hover:shadow-md transition-all">
          <Heart className="text-gray-700 hover:text-red-500 transition-colors" size={24} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            {rating} ★
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-1">{author}</p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">RS{price}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            availability === 'In Stock' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {availability}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full mt-3 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookProductCard;