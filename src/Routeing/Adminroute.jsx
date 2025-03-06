import React from "react";
import {Routes, Route, Navigate, Router} from "react-router-dom";
import LoginPage from "../Pages/Admin/Auth/LoginPage.jsx";
import CustomerDetails from "../components/AdminComponent/Customers/customerDetails.jsx";

import AddCategoryPage from "@/Pages/Admin/Category/AddCategoryPage.jsx";
import AddProductPage from "@/Pages/Admin/Product/AddProductPage.jsx";
import ProductListPage from "@/Pages/Admin/Product/ProductListPage.jsx";
import EditProduct from "@/components/AdminComponent/Product/EditProduct/EditProduct.jsx";
import AdminLoginPrivate from "./ProtectedRouting/Admin/AdminLoginPrivate.jsx";
import AdminPrivate from "./ProtectedRouting/Admin/AdminPrivate.jsx";

const AdminRoute=()=>{
    return(
        <Routes>
            <Route path="/login" element={<AdminLoginPrivate><LoginPage/></AdminLoginPrivate>}/>
            <Route path="/customers" element={<AdminPrivate><CustomerDetails/></AdminPrivate>}/>
            <Route path="/category" element={<AdminPrivate><AddCategoryPage/></AdminPrivate>}/>
            <Route path="/add/product" element={<AdminPrivate><AddProductPage/></AdminPrivate>}/>
            <Route path="/product/:id" element={<AdminPrivate><EditProduct/></AdminPrivate>}/>
            <Route path="/product" element={<AdminPrivate><ProductListPage/></AdminPrivate>}/>
          
           
        </Routes>
    )
}
export default AdminRoute;