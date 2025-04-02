import React from "react";
import {Routes, Route, Navigate, Router} from "react-router-dom";
import LoginPage from "../Pages/Admin/Auth/LoginPage.jsx";
import CustomerDetails from "../components/AdminComponent/Customers/customerDetails.jsx";
import AddCategoryPage from "@/Pages/Admin/Category/AddCategoryPage.jsx";
import AddProductPage from "@/Pages/Admin/Product/AddProductPage.jsx";
import ProductListPage from "@/Pages/Admin/Product/ProductListPage.jsx";
import AdminLoginPrivate from "./ProtectedRouting/Admin/AdminLoginPrivate.jsx";
import AdminPrivate from "./ProtectedRouting/Admin/AdminPrivate.jsx";
import OrderListPage from "@/Pages/Admin/OrderListPage/OrderListPage.jsx";
import AddCouponPage from "@/Pages/Admin/CouponPage/AddCouponPage.jsx";
import CouponList from "@/components/AdminComponent/Coupon/CouponList.jsx";
import OrderDetailsPage from "@/Pages/Admin/OrderListPage/OrderDetailsPage.jsx";
import EditProductPage from "@/Pages/Admin/Product/EditProductPage.jsx";
import BookSalesReport from "@/components/AdminComponent/SalesReport/SalesReport.jsx";
import CouponListPage from "@/Pages/Admin/CouponPage/CouponListPage.jsx";
import SalesPage from "@/Pages/Admin/SalesPage/SalesPage.jsx";
import DashboardpPage from "@/Pages/Admin/DashboardPage/DashboardPage.jsx";
import WalletPage from "@/Pages/Admin/WallettPage/WallettPage.jsx";

const AdminRoute=()=>{
    return(
        <Routes>
            <Route path="/login" element={<AdminLoginPrivate><LoginPage/></AdminLoginPrivate>}/>
            <Route path="/customers" element={<AdminPrivate><CustomerDetails/></AdminPrivate>}/>
            <Route path="/category" element={<AdminPrivate><AddCategoryPage/></AdminPrivate>}/>
            <Route path="/add/product" element={<AdminPrivate><AddProductPage/></AdminPrivate>}/>
            <Route path="/product/:id" element={<AdminPrivate><EditProductPage/></AdminPrivate>}/>
            <Route path="/product" element={<AdminPrivate><ProductListPage/></AdminPrivate>}/>
            <Route path="/orders" element={<AdminPrivate><OrderListPage/></AdminPrivate>}/>
            <Route path="/orders/:orderId" element={<AdminPrivate><OrderDetailsPage  /></AdminPrivate>}/>
            <Route path="/add/coupon" element={<AdminPrivate><AddCouponPage/></AdminPrivate>}/>
            <Route path="/coupon" element={<AdminPrivate><CouponListPage/></AdminPrivate>}/>
            <Route path="/sales-report" element={<AdminPrivate><SalesPage /></AdminPrivate>}/>
            <Route path="/dashboard" element={<AdminPrivate><DashboardpPage/></AdminPrivate>}/>
            <Route path="/wallet" element={<AdminPrivate><WalletPage/></AdminPrivate>} />
           
        </Routes>
    )
}
export default AdminRoute;