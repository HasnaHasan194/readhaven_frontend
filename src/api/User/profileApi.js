
import axiosInstance from './axios';


// Fetch user profile details
export const getUserProfile = async () => {
  try {
   
   const response =await axiosInstance.get('/users/profile');
   return  response.data
  }catch(error){
    throw error?.response?.data
  }

  };
  // api call to the edit the profile
  export const editProfile = async (formData) => {
    try {
      const response = await axiosInstance.put("/users/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        profileImage: formData.profileImage || ""
      });
      return response.data;
    } 
    catch (error) {
      throw error?.response?.data || error;
    }
  };