import React from  "react";
import Header from "@/components/UserComponent/LandingPage/Header";
import Banner from "@/components/UserComponent/LandingPage/Banner"
import BookProductCard from "@/components/UserComponent/Product/ProductCard";
import Footer from "@/components/UserComponent/LandingPage/Footer";
import BestSellers from "@/components/UserComponent/LandingPage/BestSellers";
const LandingPage=()=>{
    return(
        <>
        <Header/>
        <Banner/>
        <BestSellers/>
        <Footer/>
        </>
    )
}
export default LandingPage