import Dashboard from "@/components/AdminComponent/Dashboard/Dashboard";
import Sidebar from "@/components/AdminComponent/Size/Sidebar";
import React from "react";


const DashboardpPage =()=>{
    return(
        <div className="relative">
            <Sidebar/>
            <main className="md:ml-64">
            <Dashboard />
          </main>

        </div>
    )
}
export default DashboardpPage