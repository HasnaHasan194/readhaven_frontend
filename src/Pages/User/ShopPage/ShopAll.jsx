import React from "react";
import Header from "@/components/UserComponent/LandingPage/Header";
import Footer from "@/components/UserComponent/LandingPage/Footer";
import AllProducts from "@/components/UserComponent/Product/AllProduct";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
const ShopAll = () => {
  return (
    <>
      <Header />
      <ErrorBoundary>
      <AllProducts />
      </ErrorBoundary>
      <Footer />
    </>
  );
};
export default ShopAll;
