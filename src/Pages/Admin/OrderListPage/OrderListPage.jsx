import React from "react";
import Sidebar from "@/components/AdminComponent/Size/Sidebar";
import OrderList from "@/components/AdminComponent/Order/OrderList";

const OrderListPage = () => {
    return(
        <>
        <Sidebar/>
        <OrderList/>
        </>
    )
}

export default OrderListPage