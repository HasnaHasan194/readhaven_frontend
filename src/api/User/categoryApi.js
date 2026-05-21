import axiosInstance from "./axios";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/product/category");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
