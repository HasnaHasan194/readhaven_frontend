import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import AddressForm from "@/components/UserComponent/Address/AddAdress";
import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import React from "react";

const AddressPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar />
        <main className="flex-1 overflow-auto p-4">
          <ErrorBoundary>
            <AddressForm name={"Add Address"} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AddressPage;
