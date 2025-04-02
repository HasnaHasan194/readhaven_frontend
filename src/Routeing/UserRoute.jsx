import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "../Pages/User/Auth/Signup";
import OTPVerificationForm from "../Pages/User/Auth/OTPVerification";
import LoginPage from "../Pages/User/Auth/Login";
import AddProduct from "@/components/AdminComponent/Product/AddProduct";
import PasswordReset from "@/Pages/User/Auth/ForgotPassword/PasswordReset.jsx";
import ForgotPasswordPage from "@/Pages/User/Auth/ForgotPassword/ForgotPassword.jsx";
import LandingPage from "@/Pages/User/LandingPage/LandingPage";
import AllProducts from "@/components/UserComponent/Product/AllProduct";
import ShopAll from "@/Pages/User/ShopPage/ShopAll";
import ProductDetailPage from "@/Pages/User/productDetailPage/ProductDetailPage";
import AccountPage from "@/Pages/User/AccountPage/AccountPage";
import AddressPage from "@/Pages/User/AddressPage/AddAddressPage";
import AddressListPage from "@/Pages/User/AddressPage/AddressListPage";
import CartPage from "@/Pages/User/CartPage/CartPage";
import CheckOutPage from "@/Pages/User/CheckOutPage/CheckOutPage";
import UserOrdersPage from "@/Pages/User/UserOrders/UserOrdersPage";
import ItemDetailPage from "@/Pages/User/UserOrders/itemDetailPage";
import OrderDetailPage from "@/Pages/User/UserOrders/OrderDetail";
import UserPrivate from "./ProtectedRouting/User/UserPrivate";
import { WalletPage } from "@/Pages/User/WalletPage/WalletPage";
import WishlistPage from "@/Pages/User/WishlistPage/WishlistPage";


const UserRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPVerificationForm />} />
        <Route path="/forgot/verifyEmail" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop-all" element={<ShopAll />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/address" element={<AddressListPage />} />
        <Route path="/address/add" element={<AddressPage />} />
        <Route path="/address/:id" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/orders" element={<UserOrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/orders/:orderId/item/:itemId"  element={<ItemDetailPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </>
  );
};
export default UserRoute;
