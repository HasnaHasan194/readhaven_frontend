import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductDetails } from "@/api/User/productApi";
import RelatedProduct from "./RelatedProducts";
import { useMouseOverZoom } from "@/hooks/useMouseHoverZoom";




const BookProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sourceRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const cursorRef = React.useRef(null);

  const { isActive } = useMouseOverZoom(sourceRef, targetRef, cursorRef);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.width = 400;
      targetRef.current.height = 400;
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getProductDetails(id);
        console.log(data)
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);


  const nextImage = () => {
    if (product?.productImages?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.productImages.length);
    }
  };

  const prevImage = () => {
    if (product?.productImages?.length) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.productImages.length) % product.productImages.length
      );
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading book details...</div>;
  }

  if (!product) {
    return <div className="text-center text-xl text-red-500">Book not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-10">
      <canvas
        ref={targetRef}
        width="400"
        height="400"
        className="absolute bg-white pointer-events-none bottom-full translate-y-3/4 left-3/4 md:-translate-y-1/2 md:translate-x-0 md:bottom-16 md:left-1/2 border-8 w-2/5 h-96 z-10"
        style={{
          display: isActive ? "block" : "none",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              ref={sourceRef}
              src={product.productImages[currentImageIndex]}
              alt="Book Cover"
              className="w-full h-full object-cover"
            />
            <div
              ref={cursorRef}
              className="absolute pointer-events-none border-2 border-white rounded-full"
              style={{
                display: isActive ? "block" : "none",
                transform: "translate(-50%, -50%)",
              }}
            />

            <button onClick={prevImage} className="absolute left-2 top-1/2 bg-white p-2 rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 bg-white p-2 rounded-full">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto mt-4">
            {product.productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-20 h-20 border ${currentImageIndex === idx ? "border-blue-500" : "border-gray-300"
                  } rounded-lg overflow-hidden`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">By {product.writer || "Unknown Author"}</p>
          <p className="text-gray-600">Published Date: {new Date(product.publishedDate).toDateString()}</p>
          <p className="text-gray-600">Language: {product.language}</p>
          <p className="text-lg font-bold">Price: ₹{product.regularPrice.toFixed(2)}</p>
          {product.salePrice > 0 && <p className="text-red-500">Sale Price: ₹{product.salePrice.toFixed(2)}</p>}
          <p className="text-gray-700">{product.description}</p>
          <div className="flex gap-4">
            <Button className="bg-black text-white w-full">Add to Cart</Button>
            <Button className="bg-blue-500 text-white w-full">Buy Now</Button>
          </div>
        </div>
      </div>

      <RelatedProduct categoryId={product.Category._id} currentProductId={product._id} />
    </div>
  );
};

export default BookProductDetails;
