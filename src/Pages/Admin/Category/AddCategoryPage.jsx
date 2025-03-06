import React from "react";

import AddCategory from "@/components/AdminComponent/Category/AddCategory";
import { CategoryProvider } from "@/Context/CategoryContext.jsx";
import Sidebar from "@/components/AdminComponent/Size/Sidebar";

const AddCategoryPage = () =>{
    return(
        <>
        <CategoryProvider>
        <Sidebar/>
        <AddCategory/>
        </CategoryProvider>
       
        </>
    )
}

export default AddCategoryPage