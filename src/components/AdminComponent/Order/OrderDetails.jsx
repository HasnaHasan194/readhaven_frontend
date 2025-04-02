import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  approveRefund,
  getOrderById,
  updateSingleItemOrderStatus,
} from "@/api/Admin/ordersApi.js";
import { Package, User, MapPin, CreditCard, Calendar } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getOrderById(orderId);
      setOrder(response.order);
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  //to handle the status of each item in the order
  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      const response = await updateSingleItemOrderStatus(
        orderId,
        itemId,
        newStatus
      );
      await fetchOrder();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  //to handle approve refund
  const handleApproveRefund = async (orderId, itemId) => {
    try {
      const response = await approveRefund(orderId, itemId);
      await fetchOrder();
      toast.success(response.message);
    } catch (error) {
      toast.error(error?.message || "Failed to update the refund status");
    }
  };

  // Confirmation dialog for deletion
  const confirmRefund = (orderId, itemId) => {
    confirmAlert({
      title: "Are you sure you want to approve this refund ?",
      message: "This action cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleApproveRefund(orderId, itemId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-8 md:ml-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-8 md:ml-64 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600">
            The order details you're looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Calculate discount from the order totals
  const discount = order.subtotal + order.tax - order.totalAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-8 md:ml-64">
      <div className="mx-auto max-w-6xl">
        <Card className="shadow-lg border-t-4 border-t-blue-500 overflow-hidden">
          <CardHeader className="border-b bg-white sticky top-0 z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-blue-800">
                Order Details
              </CardTitle>
              <div
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status || "Processing"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Order Info
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Order ID:</span>
                    <span className="font-medium">{order.orderId}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Ordered Date:</span>
                    <span className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Method:</span>
                    <span className="font-medium uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.paymentStatus.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-500">Total:</span>
                    <span className="font-medium">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer and Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-20 text-gray-500">Name:</span>
                    <span className="font-medium">
                      {order.userId?.firstName || ""}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 text-gray-500">Email:</span>
                    <span className="font-medium">{order.userId?.email || ""}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 text-gray-500">Phone:</span>
                    <span className="font-medium">{order.userId?.phone || ""}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Shipping Address
                </h2>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.deliveryAddress.fullname}
                  </p>
                  <p>
                    {order.deliveryAddress.buildingname},{" "}
                    {order.deliveryAddress.address}
                  </p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-gray-600">
                      <span className="text-gray-500">Landmark:</span>{" "}
                      {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-3">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Order Items
              </h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.product?.productImages?.[0] ||
                            "/placeholder.svg"
                          }
                          alt={item?.product?.name || "Product"}
                          className="w-20 h-20 rounded-md object-cover border"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                          <p>
                            Quantity:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 text-sm">
                          <p>
                            Price:{" "}
                            <span className="font-medium">
                              ₹{item.productPrice.toFixed(2)}
                            </span>{" "}
                            each
                          </p>
                          <p>
                            Total:{" "}
                            <span className="font-medium">
                              ₹{(item.productPrice * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex flex-wrap items-center gap-3">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <select
                            value={item.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                orderId,
                                item._id,
                                e.target.value
                              )
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          >
                            <option
                              value="Pending"
                              disabled={
                                item.status !== "Pending" &&
                                item.status !== undefined
                              }
                            >
                              Pending
                            </option>
                            <option
                              value="Processing"
                              disabled={
                                item.status !== "Pending" &&
                                item.status !== "Processing"
                              }
                            >
                              Processing
                            </option>
                            <option
                              value="Shipped"
                              disabled={
                                item.status !== "Processing" &&
                                item.status !== "Shipped"
                              }
                            >
                              Shipped
                            </option>
                            <option
                              value="Delivered"
                              disabled={
                                item.status !== "Shipped" &&
                                item.status !== "Delivered"
                              }
                            >
                              Delivered
                            </option>
                            <option
                              value="Cancelled"
                              disabled={item.status === "Delivered"}
                            >
                              Cancelled
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status || "Pending"}
                        </div>

                        {/* Refund Button */}
                        {item.status === "Returned" ? (
                          item.refundStatus === "Approved" ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Refunded
                            </span>
                          ) : (
                            <button
                              onClick={() => confirmRefund(orderId, item._id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-all"
                            >
                              Approve Refund
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
