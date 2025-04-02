import { data } from "react-router-dom";
import axiosInstance from "./axios";
//to place the order when cod
export const placeOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/users/orders", orderData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};


//to get all orders made by the user
export const getUserOrders = async (page = 1, limit = 5) => {
  try {
    const response = await axiosInstance.get(
      `/users/orders?page=${page}&limit=${limit}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//to get the details of an item in the order
export const getItemDetails = async (orderId, itemId) => {
  try {
    const response = await axiosInstance.get(
      `/users/orders/${orderId}/item/${itemId}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//to get a order details by its id
export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`users/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

// to cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.patch(
      `/users/orders${orderId}/cancel`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
//to cancel a single item in the order
export const cancelSingleItem = async (orderId, itemId, returnReason) => {
  try {
    const response = await axiosInstance.patch(
      `/users/orders/${orderId}/item/${itemId}/cancel`,
      { returnReason }
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//to return a item in the order
export const returnItem = async (orderId, itemId, returnReason) => {
  try {
    const response = await axiosInstance.patch(
      `/users/orders/${orderId}/item/${itemId}/return`,
      { returnReason }
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
