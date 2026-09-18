import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import UserOrders from "@/components/UserComponent/Order/UserOrders";
import React from "react";

const  UserOrdersPage= () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="md:block w-full md:w-auto">
          <UserSideBar />
        </div>
        <main className="flex-1 overflow-auto p-4">
          <UserOrders />
        </main>
      </div>
    </div>
  )
}
export default UserOrdersPage