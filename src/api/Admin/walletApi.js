import { data } from "react-router-dom";
import axiosInstance from "../User/axios";

//to get the transactions
export const getWalletTransactions = async () => {
    try{
        const response = await axiosInstance.get('/admin/wallet');
        return response.data
    }
    catch(error){
        throw error?.response?.data ||error
    }
}