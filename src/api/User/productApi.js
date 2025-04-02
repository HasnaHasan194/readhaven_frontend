import axiosInstance from "./axios";

export const getProducts = async (
  currentPage,
  productsPerPage,
  searchQuery,
  category,
  priceRange,
  author,
  sortOption,
  language
) => {
  const response = await axiosInstance.get("/users/products", {
    params: {
      page: currentPage,
      limit: productsPerPage,
      searchQuery,
      category,
      priceRange,
      author,
      sortOption,
      language,
    },
  });
  return response.data;
};

//get the  best selling products
export const getBestSellingProducts = async () => {
  try {
    const response = await axiosInstance.get("/users/bestsellers");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//get a product details
export const getProductDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/productDetails/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//to get related products
export const getRelatedProducts = async (category, exclude) => {
  try {
    const response = await axiosInstance.get(
      `/users/products/relatedproducts?category=${category}&exclude=${exclude}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
