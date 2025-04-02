import { Description } from "@radix-ui/react-dialog";
import axiosInstance from "./axios";

//API call to get the wallet
export const getWalletData = async(page = 1) =>{
    try{
        const response = await axiosInstance.get(`/users/wallet?page=${page}`);
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API  call to deduct the wallet
export const deductWallet =async(amount,description)=>{
    try{
        const response =await axiosInstance.patch('/users/wallet/deduct',amount,description);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error;
    }
}