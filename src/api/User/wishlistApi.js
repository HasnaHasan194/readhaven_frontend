import axiosInstance from "./axios";

//API call to get the wishlist 
export const getWishlist =async()=>{
    try{
        const response =await axiosInstance.get('/users/wishlist');
        return response.data;
    }catch(error){
        throw error?.response?.data || error
        
    }
}
//API call to add to the wishlist
export const addToWishlist =async(productId)=>{
    try{
        const response =await axiosInstance.post('/users/wishlist/add',{productId});
        return response.data;

    }
    catch(error){
        console.log(error)
        throw error?.response?.data ||  error;
    }
}


//API call to remove item from wishlist
export const removeFromWishlist  =async(productId)=>{
    try{
        const response = await axiosInstance.post('/users/wishlist/remove',{productId});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}