import React, { useEffect, useState } from 'react';
import BookProductCard from '../Product/ProductCard';
import { ChevronRight } from 'lucide-react';
import { getBestSellingProducts } from '@/api/User/productApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BestSellers = () => {
    const [products,setProducts] = useState([]);
    const navigate = useNavigate();

   useEffect(() => {
      const fetchProducts = async() => {
        try{
            const response = await getBestSellingProducts();
            setProducts(response.products);
        }
        catch(error){
            toast.error(error?.message);
        }
      }
      fetchProducts()
   },[]);

  return (
    <div className="container mx-auto p-4">
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-5xl ml-32 mt-14 hover:text-blue-300  font-serif">Best Sellers</h2>
        
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-32">
      {products.map((product, index) => (
        <div
        key={product._id}
        onClick={() => navigate(`/product-detail/${product._id}`)}
        className="cursor-pointer"
      >
        <BookProductCard 
          key={index}
          id={product._id}
          name={product.name}
          rating={product.rating || 4.5}
          price={product.regularPrice}
          image={product.productImages[0]}
          author={product.author || "Unknown"}
          availability={product.availableQuantity}
        
        />
          </div>
      ))}
    </div>

    </div>
  );
};

export default BestSellers;
