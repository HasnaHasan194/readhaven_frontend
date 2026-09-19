import Header from "@/components/UserComponent/LandingPage/Header";
import React from "react";
import AddressList from "@/components/UserComponent/Address/AdressList";
import UserSideBar from "@/components/UserComponent/UserSideBar";
const AddressListPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        <div className="md:block w-full md:w-auto z-10 border-t md:border-t-0">
          <UserSideBar />
        </div>
        <main className="flex-1 overflow-auto p-4">
          <AddressList />
        </main>
      </div>
    </div>
  );
};

export default AddressListPage;
