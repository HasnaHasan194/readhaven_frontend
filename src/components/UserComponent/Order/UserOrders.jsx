

import {getUserOrders } from "@/api/User/orderApi.js";
import { Button } from '@/components/ui/button';
import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {Download, ShoppingBag, Clock, Package, X, ChevronRight, Eye, ChevronLeft, ChevronUp} from "lucide-react"
import { toast } from "react-toastify";
import Invoice from "./Invoice";
// import Invoice from './Invoice';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState();
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    
    // Pagination states
    const [pagination, setPagination] = useState({
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      hasNextPage: false,
      hasPrevPage: false
    });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
  
    const navigate = useNavigate();
  
    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    useEffect(() => {
      fetchUserOrders();
    }, [page, limit]);
    
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const response = await getUserOrders(page, limit);
        setOrders(response.orders);
        setPagination(response.pagination);
      } catch (error) {
        console.log("Error in fetching orders");
        toast.error(error?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
  
    // Handle page change
    const handlePageChange = (newPage) => {
      setPage(newPage);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Handle records per page change
    const handleLimitChange = (newLimit) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
    };
  
    // Full order cancellation
    const handleCancel = async (orderId) => {
      try {
        const response = await cancelOrder(orderId);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
        toast.success(response.message);
      } catch (error) {
        console.log(error);
        toast.error(error?.message || "Failed to cancel order");
      }
    };
  
    // Confirmation dialog for full order cancellation
    const confirmCancel = (e, orderId) => {
      e.preventDefault();
      e.stopPropagation();
      Modal.confirm({
        title: "Are you sure you want to cancel this order?",
        content: "This action cannot be undone.",
        okText: "Yes, Cancel Order",
        okButtonProps: { danger: true },
        cancelText: "No, Keep Order",
        onOk() {
          handleCancel(orderId);
        },
      });
    };
  
    // Function to get status badge style (for additional use)
    const getStatusStyle = (status) => {
      switch (status) {
        case 'Delivered':
          return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        case 'Pending':
          return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'Processing':
          return 'bg-sky-50 text-sky-700 border border-sky-200';
        case 'Shipped':
          return 'bg-violet-50 text-violet-700 border border-violet-200';
        case 'Cancelled':
          return 'bg-rose-50 text-rose-700 border border-rose-200';
        default:
          return 'bg-slate-50 text-slate-700 border border-slate-200';
      }
    };
  
    // Function to get status icon
    const getStatusIcon = (status) => {
      switch (status) {
        case 'Delivered':
          return <Package className="w-4 h-4" />;
        case 'Pending':
          return <Clock className="w-4 h-4" />;
        case 'Processing':
          return <ShoppingBag className="w-4 h-4" />;
        case 'Shipped':
          return <Package className="w-4 h-4" />;
        case 'Cancelled':
          return <X className="w-4 h-4" />;
        default:
          return <Clock className="w-4 h-4" />;
      }
    };
  
    // Pagination component
    const PaginationControls = () => {
      if (pagination.totalPages <= 1) return null;
      
      return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6 rounded-lg shadow-sm">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * limit, pagination.totalOrders)}
                </span>{" "}
                of <span className="font-medium">{pagination.totalOrders}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="mr-4">
                <label htmlFor="limit" className="mr-2 text-sm text-gray-600">Show:</label>
                <select 
                  id="limit"
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="rounded border border-gray-300 py-1 px-2 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!pagination.hasPrevPage}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    !pagination.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">First page</span>
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-1" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    !pagination.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Show page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  // Complex logic to show appropriate page buttons around current page
                  let pageNum;
                  const totalVisiblePages = Math.min(5, pagination.totalPages);
                  
                  if (pagination.currentPage <= 3) {
                    // At the beginning, show first 5 pages
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    // At the end, show last 5 pages
                    pageNum = pagination.totalPages - totalVisiblePages + i + 1;
                  } else {
                    // In the middle, show 2 before current, current, and 2 after current
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  // Only show the page button if it's a valid page number
                  if (pageNum > 0 && pageNum <= pagination.totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={pagination.currentPage === pageNum ? "page" : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pagination.currentPage === pageNum
                            ? "bg-teal-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    !pagination.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    !pagination.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Last page</span>
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-1" />
                </button>
              </nav>
            </div>
          </div>
          
          {/* Mobile pagination */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                !pagination.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 self-center">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                !pagination.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      );
    };
  
    if (loading) {
      return (
        <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading your orders...</p>
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">No Orders Yet</h2>
            <p className="text-slate-600 mb-8">You haven't placed any orders yet. Start exploring our collection!</p>
            <Button 
              onClick={() => navigate('/shop-all')} 
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
            >
              Discover Books
            </Button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="w-full max-w-6xl mx-auto p-6 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
            <p className="text-slate-500 mt-1">Track and manage your purchases</p>
          </div>
          <Button 
            onClick={() => navigate('/shop-all')} 
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>
        
        <div className="space-y-6">
          {orders.map(order => (
            <div 
              key={order._id} 
              onClick={() => navigate(`/orders/${order.orderId}`)} 
              className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md relative cursor-pointer"
            >
              {/* Order Header */}
              <div className="bg-slate-50 p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h2 className="text-lg font-bold text-slate-800">Order #{order.orderId}</h2>
                  </div>
                  <p className="text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
  
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={(e)=>{
                      e.stopPropagation();
                      setSelectedOrder(order.orderId);
                      setInvoiceOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white flex items-center text-sm rounded-lg"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Invoice
                  </Button>
                  
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-slate-500">ORDER TOTAL</div>
                    <div className="text-lg font-bold text-slate-800">₹{order.totalAmount?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              </div>
  
              {/* Order Content */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-slate-500">
                      ITEMS ({order.items.reduce((total, item) => total + (item.quantity || 0), 0)})
                    </h3>
                    <motion.div
                      className="hidden sm:flex items-center gap-1 text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Eye className="w-3 h-3" />
                      Click for details
                    </motion.div>
                  </div>
                  
                  <div className="md:hidden text-right">
                    <h3 className="text-sm font-medium text-slate-500">TOTAL</h3>
                    <p className="text-lg font-bold">₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
    
                {/* Items Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={item._id || index} 
                      className="flex flex-col bg-white rounded-lg border border-gray-100 overflow-hidden transition-all hover:border-teal-200 hover:shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="w-full aspect-square overflow-hidden border-b border-gray-100 bg-gray-50 relative">
                        <img 
                          src={item.product?.productImages?.[0] || '/placeholder.svg'} 
                          alt={item.product?.name || 'Product'} 
                          className="w-full h-full object-cover"
                        />
                        {(item.status === "Cancelled" || item.status === "Returned") && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="text-xs font-bold text-white uppercase">
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="p-3 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-slate-800 line-clamp-2 text-sm">
                            {item.product?.name || 'Product Name'}
                          </h4>
                          {(item.status === "Cancelled" || item.status === "Returned") && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full text-xs flex-shrink-0">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs text-slate-500 mb-3">
                        
                          <span>Qty: {item.quantity}</span>
                          <span className="col-span-2">Price: ₹{item.productPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        
                        {/* View Details Button */}
                        <div className="mt-auto pt-2">
                          <Link 
                            to={`/orders/${order.orderId}/item/${item._id}`}
                            className="w-full px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                            onClick={(event) => event.stopPropagation()}
                          >
                            View Details
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>     
          ))}

          
        </div>
  
        {/* Render pagination controls */}
        <PaginationControls />
  
        {invoiceOpen &&  (
        <Modal
          open={invoiceOpen}
          onCancel={() => setInvoiceOpen(false)}
          footer={null}
          width={1000}
          centered
          destroyOnClose
        >
          <Invoice order={selectedOrder} />
        </Modal>
        )}
      </div>
    );
  };
  
  export default UserOrders;