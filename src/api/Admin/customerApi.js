import axiosInstance from "../User/axios";

// api call to fetch users
export const getUsers =async(page =1,limit=5)=>{
    try{
        const response =await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}`,{withCredentials:true});
        return response.data;
    }catch(error){
        throw error?.response?.data || error
    }
}

//api call to edit user
export const editUser=async(id)=>{
    console.log("api is calling")
    try{
        const response=await axiosInstance.put(`/admin/users/${id}`,{},{withCredentials : true});
        return response.data
}
catch(error){
    throw error?.response?.data || error
}
}