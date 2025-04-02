import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joi from "joi";
import ImageCropper from "../ImageCropper";
import {
  getCategoryDropDown,
  getProductEdit,
  productService,
} from "@/api/Admin/productApi";
import { uploadToCloudinary } from "@/Utils/cloudinary/upload-cloudinary";
import { useNavigate, useParams } from "react-router-dom";

// Joi Validation Schema
const productValidationSchema = Joi.object({
  name: Joi.string()
  .trim()
  .pattern(/^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/) // Allows letters, numbers, and spaces, but no special characters
  .required()
  .messages({
    "string.pattern.base": "Name should contain only alphabets, numbers, and spaces (no special characters).",
    "string.empty": "Name is required.",
  }),
  publishedDate: Joi.date().required().messages({
    "date.base": "Published date must be a valid date.",
  }),
  writer: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "writer name should contain only alphabets.",
      "string.empty": "writer name is required.",
    }),
  Category: Joi.string().required().messages({
    "string.base": "Category must be a valid ObjectId.",
    "any.required": "Category is required.",
  }),
  language: Joi.string()
    .valid("English", "Malayalam", "Hindi", "Tamil")
    .required()
    .messages({
      "string.base": "Language must be a string.",
      "any.only": "Language must be one of English, Malayalam, Hindi, Tamil.",
    }),
  regularPrice: Joi.number().required().min(0).messages({
    "number.base": "Regular price must be a number.",
    "number.min": "Regular price must be greater than or equal to 0.",
    "any.required": "Regular price is required.",
  }),
  productOffer: Joi.number().optional().min(0).messages({
    "number.base": "Product offer must be a number.",
    "number.min": "Product offer must be greater than or equal to 0.",
  }),
  description: Joi.string().required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
  }),
  availableQuantity: Joi.number().required().min(0).messages({
    "number.base": "Available quantity must be a number.",
    "number.min": "Available quantity must be greater than or equal to 0.",
    "any.required": "Available quantity is required.",
  }),
  productImages: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .required()
    .messages({
      "array.base": "Product images must be an array of strings.",
      "array.empty": "At least one product image is required.",
      "string.uri": "Each product image must be a valid URI.",
    }),
  createdAt: Joi.date()
    .required()
    .default(() => new Date())
    .messages({
      "date.base": "Created date must be a valid date.",
    }),
});

const EditProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    publishedDate: "",
    writer: "",
    Category: "",
    language: "English",
    regularPrice: "",
    productOffer: "0",
    description: "",
    availableQuantity: "0",
    productImages: [],
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchCategories = async () => {
    try {
      const response = await getCategoryDropDown();
      setCategories(response.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductEdit(id);
        const product = response.product;

        const formattedDate = product.publishedDate
          ? new Date(product.publishedDate).toISOString().split("T")[0]
          : "";

        setFormData({
          name: product.name || "",
          publishedDate: formattedDate,
          writer: product.writer || "",
          Category: product.Category?._id || "",
          language: product.language || "English",
          regularPrice: product.regularPrice?.toString() || "",
          productOffer: product.productOffer?.toString() || "0",
          description: product.description || "",
          availableQuantity: product.availableQuantity?.toString() || "0",
          productImages: product.productImages || [],
        });

        setImageUrls(product.productImages || []);
      } catch (error) {
        toast.error(error?.message || "Failed to load product data");
        console.error(error);
      }
    };

    fetchProducts();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImagePreviewUrl(reader.result);
      setCurrentImageFile(file);
      setCurrentImageIndex(index);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageUrl) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `cropped-image-${currentImageIndex}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      const cloudinaryUrl = await uploadToCloudinary(file);

      const updatedImageUrls = [...imageUrls];
      updatedImageUrls[currentImageIndex] = cloudinaryUrl;
      setImageUrls(updatedImageUrls);

      const updatedImages = [...formData.productImages];
      updatedImages[currentImageIndex] = cloudinaryUrl;
      setFormData((prev) => ({ ...prev, productImages: updatedImages }));

      setCropModalOpen(false);
    } catch (error) {
      console.error("Error processing and uploading cropped image:", error);
      toast.error("Failed to upload image");
    }
  };

  const removeImage = (index) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls[index] = null;
    setImageUrls(updatedImageUrls);

    const updatedProductImages = [...formData.productImages];
    updatedProductImages[index] = null; // Keep the array length, set to null
    setFormData((prev) => ({
      ...prev,
      productImages: updatedProductImages.filter(Boolean),
    })); // Filter out nulls
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Prepare data for validation, converting string numbers to actual numbers
    const productData = {
      ...formData,
      regularPrice: Number(formData.regularPrice),
      productOffer: Number(formData.productOffer),
      availableQuantity:
        formData.availableQuantity === ""
          ? undefined
          : Number(formData.availableQuantity),
      createdAt: new Date(), // Joi will use default if not provided
      productImages: formData.productImages.filter(Boolean), // Remove nulls from array
    };

    // Validate with Joi
    const { error } = productValidationSchema.validate(productData, {
      abortEarly: false, // Capture all validation errors
    });

    if (error) {
      const errorMessages = {};
      error.details.forEach((detail) => {
        errorMessages[detail.path[0]] = detail.message;
      });
      setErrors(errorMessages);
      console.log("error messages", errorMessages);
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      const response = await productService.editProduct(id, productData);

      toast.success(response.message || "Product updated successfully");
      navigate("/admin/product");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";
      toast.error(errorMessage);
      console.error("Product submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ml-60 bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-black py-6 px-6">
            <h1 className="text-2xl font-bold text-white">Edit Product</h1>
            <p className="text-purple-100 mt-1">
              Enter the details to update product in inventory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="py-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Published Date */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.publishedDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.publishedDate}
                  </p>
                )}
              </div>

              {/* Writer */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Writer/Author <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="writer"
                  value={formData.writer}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.writer && (
                  <p className="text-red-500 text-sm mt-1">{errors.writer}</p>
                )}
              </div>

              {/* Category */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.Category && (
                  <p className="text-red-500 text-sm mt-1">{errors.Category}</p>
                )}
              </div>

              {/* Language */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language <span className="text-red-600">*</span>
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                </select>
                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                )}
              </div>

              {/* Regular Price */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="p-2 pl-8 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.regularPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.regularPrice}
                  </p>
                )}
              </div>

              {/* Sale Price */}
              {/* <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="p-2 pl-8 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.salePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salePrice}
                  </p>
                )}
              </div> */}

              {/* Product Offer */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Offer (%)
                </label>
                <input
                  type="number"
                  name="productOffer"
                  value={formData.productOffer}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                  max="100"
                />
                {errors.productOffer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productOffer}
                  </p>
                )}
              </div>

              {/* Available Quantity */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Quantity <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
                {errors.availableQuantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availableQuantity}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Image Uploads */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images <span className="text-red-600">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload up to 3 images. Images will be cropped.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative">
                      {imageUrls[index] ? (
                        <div className="relative">
                          <img
                            src={imageUrls[index]}
                            alt={`Product ${index + 1}`}
                            className="h-48 w-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-10 h-10 mb-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                {errors.productImages && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productImages}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <ImageCropper
          image={currentImagePreviewUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EditProduct;
