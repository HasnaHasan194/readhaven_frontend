import Header from "@/components/UserComponent/LandingPage/Header";
import React from "react";
import AddressList from "@/components/UserComponent/Address/AdressList";
import UserSideBar from "@/components/UserComponent/UserSideBar";
const AddressListPage = () => {
  return (
    <div className="flex flex-col h-screen ">
      <Header />
      <div className="flex flex-1 overflow-hidden">
       <UserSideBar/>
        <main className="flex-1 ml-64 p-4">
          <AddressList />
        </main>
      </div>
    </div>
  );
};

export default AddressListPage;
