import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "@/api/User/wishlistApi";
import { ShoppingCart, Trash2, Heart, AlertCircle, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/api/User/cartApi";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  
  //to get the items in the wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const response = await getWishlist();
        console.log(response);
        setWishlist(response.wishlist.products || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);

      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Custom notification function
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Function to add product to the cart
  const handleAddToCart = async(productId) => {
    const payLoad = {
      productId: productId
    };

    try {
      const response = await addToCart(payLoad);
      showNotification(response.message || "Added to cart successfully", "success");
    } catch(error) {
      showNotification(error?.message || "Failed to add to cart", "error");
      console.log(error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      showNotification(response.message || "Removed from wishlist", "success");
      
      // Update the wishlist by filtering out the removed item
      setWishlist(wishlist.filter(item => item.productId._id !== productId));
    } catch (error) {
      showNotification(error?.message || "Failed to remove from wishlist", "error");
      console.error("Error removing from wishlist:", error);
    }
  };

  // Helper function to check if product is in stock
  const isInStock = (product) => {
    if (!product) return false;
    return product.
    availableQuantity
     > 0;
  };

  // Function to get available quantity
  const getAvailableQuantity = (product) => {
    if (!product) return 0;
    return product.
    availableQuantity
     || 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen relative">
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-md animate-fade-in ${
          notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : 
          "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {notification.type === "success" ? 
            <CheckCircle className="w-5 h-5" /> : 
            <XCircle className="w-5 h-5" />
          }
          <p>{notification.message}</p>
        </div>
      )}

      {/* Header Section with subtle gradient background */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-4">
              <Heart className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600">Items you've saved for later</p>
            </div>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Empty State with refined design */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-md border border-gray-100">
          <div className="w-24 h-24 flex items-center justify-center bg-indigo-50 rounded-full mb-6">
            <Heart className="w-12 h-12 text-indigo-300" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-md mb-8">Explore our collection and heart your favorite items</p>
          <button 
            onClick={() => navigate("/shop-all")} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            Browse Products <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {wishlist.map((item) => {
            const inStock = isInStock(item.productId);
            const availableQty = getAvailableQuantity(item.productId);
            
            return (
              <div 
                key={item.productId._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image with enhanced styling */}
                  <div className="md:w-56 h-56 relative overflow-hidden flex-shrink-0 bg-gray-50">
                    <img
                      src={item.productId.productImages[0] || "/api/placeholder/400/400"}
                      alt={item.productId.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  
                  </div>
                  
                  {/* Product Info & Actions with refined layout */}
                  <div className="flex-grow p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.productId.name}</h3>
                          <div className="mb-3">
                            {inStock ? (
                              <span className="text-green-600 flex items-center text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                In Stock ({availableQty})
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center text-sm">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-700">
                            ₹{item.productId.regularPrice || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons with improved styling */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <button
                        onClick={() => handleAddToCart(item.productId._id)}
                        className={`flex-1 flex items-center justify-center gap-2 ${
                          inStock 
                            ? "bg-indigo-600 hover:bg-indigo-700" 
                            : "bg-gray-300 cursor-not-allowed"
                        } text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm`}
                        disabled={!inStock}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">{inStock ? "Add to Cart" : "Out of Stock"}</span>
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId._id)}
                        className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Bottom Nav with refined styling */}
      {wishlist.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between">
          <button 
            onClick={() => navigate("/cart")} 
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart
          </button>
          <button 
            onClick={() => navigate("/shop-all")} 
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-5 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            Continue Shopping <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;