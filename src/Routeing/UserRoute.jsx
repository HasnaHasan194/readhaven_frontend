import React from "react";
import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import SignupForm from "../Pages/User/Auth/Signup";
import OTPVerificationForm from "../Pages/User/Auth/OTPVerification";
import LoginPage from "../Pages/User/Auth/Login";
import AddProduct from "@/components/AdminComponent/Product/AddProduct";
import PasswordReset from "@/Pages/User/Auth/ForgotPassword/PasswordReset.jsx";
import ForgotPasswordPage from "@/Pages/User/Auth/ForgotPassword/ForgotPassword.jsx"
import LandingPage from "@/Pages/User/LandingPage/LandingPage";
import AllProducts from "@/components/UserComponent/Product/AllProduct";
import ShopAll from "@/Pages/User/ShopPage/ShopAll";
import BookProductDetails from "@/components/UserComponent/Product/ProductDetail";
import ProductDetailPage from "@/Pages/User/productDetailPage/ProductDetailPage";



const UserRoute=()=>{
    return(
        <> 
        <Routes>
        <Route path="/signup" element={<SignupForm/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/otp" element={<OTPVerificationForm/>}/>
        <Route path="/forgot/verifyEmail" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password" element={<PasswordReset/>}/>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/shop-all" element={<ShopAll/>}/>
        <Route path="/product-detail/:id" element={<ProductDetailPage/>}/>
        </Routes>   
        </>
    )
}
export default UserRoute;
