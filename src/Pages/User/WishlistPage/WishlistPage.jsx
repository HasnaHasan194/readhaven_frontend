import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import Wishlist from "@/components/UserComponent/WishList/WishList";
import React from "react";
const WishlistPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        <div className="md:block w-full md:w-auto z-10 border-t md:border-t-0">
          <UserSideBar />
        </div>
        <main className="flex-1 overflow-auto p-4">
          <ErrorBoundary>
            <Wishlist />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
export default WishlistPage;
