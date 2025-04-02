import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { addToWishlist, getWishlist } from '@/api/User/wishlistApi';
import { toast } from 'react-toastify'
import { useQueryClient } from "@tanstack/react-query";
import { useCartMutation } from "@/hooks/react-query/useCartCount";



const BookProductCard = ({
  id,
  name,
  rating,
  price, 
  salePrice, 
  image,
  author,
  availability,
  Category 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const { mutate: addToCart } = useCartMutation();

    // function to add product to the cart
    const handleAddToCart = async () => {
      const payLoad = {
         productId : id,
      };
      addToCart(payLoad, {
        onSuccess: (data) => toast.success(data.message),
        onError: (error) => toast.error(error?.response.data.message),
      });
    };
  
  
  // Calculate discount percentage
  const discountPercentage = price && salePrice ? Math.round((price - salePrice) / price * 100) : 0;
  const hasDiscount = salePrice && salePrice < price;

  // Animation effect for discount badge
  useEffect(() => {
    if (hasDiscount) {
      const timer = setTimeout(() => {
        setIsDiscountVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasDiscount]);

  // Check wishlist status on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await getWishlist();
        const wishlistItems = response?.wishlist?.products || [];
        const isProductInWishlist = wishlistItems.some(item =>
          item?.productId?._id === id 
        );
        setIsLiked(isProductInWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setIsLiked(false);
      }
    };
    checkWishlistStatus();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      if (!isLiked) {
        const response = await addToWishlist(id);
        toast.success(response.success);
        setIsLiked(true); // Changed from false to true as this is an add operation
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      message.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <div 
      className="group relative w-72 bg-gradient-to-br from-cream-50 to-cream-100 shadow-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Subtle Zoom and Overlay */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-80 object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110 brightness-105' : 'scale-100'
          }`}
        />
        
        {/* Discount Badge - Animated */}
        {hasDiscount && (
          <div 
            className={`absolute top-0 left-0 bg-red-500 text-white px-3 py-1 rounded-br-lg font-bold shadow-lg transition-all duration-500 transform ${
              isDiscountVisible ? 'translate-x-0 rotate-0' : '-translate-x-full rotate-12'
            }`}
          >
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button
          onClick={(event) => {
            event.stopPropagation(); 
            setIsLiked(!isLiked);
            handleWishlistToggle(event);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-brown-800 truncate max-w-[70%]">{name}</h3>
          <div className="flex items-center bg-brown-100 text-brown-800 px-2.5 py-1 rounded-full text-sm font-medium">
            {rating} <span className="ml-1">★</span>
          </div>
        </div>

        <p className="text-brown-600 text-sm mb-1 font-medium italic">{author}</p>
        {/* Add the category name here */}
        <p className="text-brown-500 text-sm mb-3">Category: {Category}</p>

        <div className="flex justify-between items-center mb-4">
          {/* Price Display with Line-through for Regular Price when Sale Price exists */}
          <div className="flex items-center space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-brown-600">₹{salePrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-brown-600">₹{price}</span>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            availability === 'In Stock' 
              ? 'bg-brown-100 text-brown-700' 
              : 'bg-rose-100 text-rose-700'
          }`}>
            {availability}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={(e)=>{
            e.stopPropagation();
             handleAddToCart()
          }}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-brown-100 to-brown-200 text-brown-700 hover:from-brown-200 hover:to-brown-300 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md active:scale-95"
        >
          <ShoppingCart size={20} className="text-brown-600" />
          <span className="font-semibold">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookProductCard;