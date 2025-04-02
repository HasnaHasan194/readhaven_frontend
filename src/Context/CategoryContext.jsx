import { addCategory,getCategory,blockCategory,editCategory, addOffer } from "@/api/Admin/categoryApi.js";
import React,{ createContext,useContext,useEffect,useState} from "react";
import { toast } from "react-toastify";


const CategoryContext=createContext();
export const CategoryProvider=({children})=>{
    const [categories,setCategories]=useState([]);
    const [loading,setLoading]=useState(false);

    //get categories
    const fetchCategories=async(page=1,limit=5)=>{
        try{
            const  response=await getCategory(page ,limit);
            setCategories(response.categories)
        }
        catch(error){
            console.log("Error fetching categories",error);
            toast.error("failed to fetch categories");
        }
    }

    //add new category
    const addNewCategory =async(FormData)=>{
        if(!FormData.name || !FormData.description){
            toast.error("All fields are required");
            return;
        }
        setLoading(true);
        try{
            const response=await addCategory(FormData);
            console.log(response)
            toast.success(response.message);
            await fetchCategories();
        }
        catch(error){
            toast.error(error?.message || "Error adding category")
        }
        finally{
            setLoading(false)
        }
    }

    //block or unblock the user
    const blockOrUnblockCategory=async(id)=>{
        try{
          const response=await blockCategory(id);
          // Update the categories state
          setCategories(prevCategories=>
            prevCategories.map(category=>
             category._id === id ?{...category,isActive :!category.isActive} :category
            )
          )
        }
        catch(error){
            toast.error("error updating status");
            console.log("error updating status",error);
        }
    }

    //edit Category
    const categoryEdit =async (categoryId,data)=>{
        try{
            const response=await editCategory(categoryId,data);
            toast.success(response.message);
            await fetchCategories();
        }catch(error){
            console.log('error updating category',error);
            toast.error(error?.message || "Error updating category")
        }
    }

    //add offer
    const offerAdd = async(id,offer) =>{
        try{
            const response = await addOffer(id,offer);

            toast.success(response.message);

            await fetchCategories()
        }
        catch(error){
           console.log("error adding offer",error);
           toast.error("error updating offer")
        }
     }

     //edit offer
     

    useEffect(()=>{
        fetchCategories()
    },[]);

    return(
        <CategoryContext.Provider value={{
            categories,
            setCategories,
            loading,
            addNewCategory,
            blockOrUnblockCategory,
            categoryEdit,
            offerAdd
        }}>{children}

        </CategoryContext.Provider>

    
    )
}
export const useCategory=()=>useContext(CategoryContext);
