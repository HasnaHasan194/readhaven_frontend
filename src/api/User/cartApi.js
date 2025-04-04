import axiosInstance from "./axios";

// API call to add the product to the cart
export const addToCart = async (payLoad) => {
  const response = await axiosInstance.post(`/users/cart`, payLoad);
  return response.data;
};
// API call to get the cart products

export const getCartProducts = async () => {
  const response = await axiosInstance.get(`/users/cart`);
  console.log("cart",response)
  return response.data;
};
//API call to change the quantity
export const updateCartItemQuantity = async (itemId, change) => {
  try {
    const response = await axiosInstance.patch(`/users/cart/${itemId}`, {
      change,
    });
    return response.data;
  } catch (error) {
    console.log('clog from cart api=> ', error)
    throw error
  }
};
//API call to remove the item from the cart
export const removeCartItem = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/users/cart/${itemId}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
//API calll to proceed to checkout
export const proceedToCheckout = async () => {
  try {
    const response = await axiosInstance.get("/users/proceedToCheckout");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
//API call to get the cart item count oof user
export const getCartCount = async () => {
  const response = await axiosInstance.get(`/users/cart-count`);
  return response.data;
};
