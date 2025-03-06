import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Product/ProductCard";
import { getRelatedProducts } from "@/api/User/productApi";
import BookProductCard from "../Product/ProductCard";


const RelatedProduct = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await getRelatedProducts(categoryId, currentProductId);
        setRelatedProducts(response.products || []); // Handle empty response
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading related books...</p>
      </div>
    );
  }

  if (!relatedProducts.length) {
    return (
      <div className="py-8 text-center">
        <p>No related books found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white px-4 py-8 md:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-3xl text-left ml-4 md:text-4xl font-bold text-black mb-12">
        YOU MAY ALSO LIKE
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto px-4">
        {relatedProducts.slice(0, 3).map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product-detail/${product._id}`)}
            className="cursor-pointer"
          >
            <BookProductCard
              name={product.name}
              rating={product.rating || 4.5}
              price={product.regularPrice}
              image={product.productImages[0]}
              author={product.writer || "Unknown"}
              availability={product.availableQuantity}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
