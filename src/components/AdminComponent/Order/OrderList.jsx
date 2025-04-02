import { useEffect, useState } from "react";
import {
  ChevronDown,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllOrders, updateOrderStatus } from "@/api/Admin/ordersApi.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "processing":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const allowedTransitions = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const isOptionDisabled = (currentStatus, optionValue) => {
  if (currentStatus === optionValue) return true;
  return !allowedTransitions[currentStatus]?.includes(optionValue);
};

export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Modified API call to include pagination, sorting, and filtering
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrders({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter === "All" ? undefined : statusFilter,
        sortField,
        sortOrder: sortOrder === "asc" ? 1 : -1,
      });
      console.log(response)
      setOrders(response.orders);
      setTotalOrders(response.total || response.orders.length); 
    } catch (error) {
      toast.error("Error fetching orders", {
        description: error?.response?.data?.message || "Something went wrong",
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, sortField, sortOrder]);

  const handleStatusChange = async (orderId, newStatus) => {
    const currentOrder = orders.find((order) => order.orderId === orderId);
    if (isOptionDisabled(currentOrder.status, newStatus)) {
      toast.error("Invalid status transition", {
        description: `Cannot change status from ${currentOrder.status} to ${newStatus}`,
      });
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after status change
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status", {
        description: error?.message || "Failed to change order status",
      });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white md:ml-64">
      <div className="p-4 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Card className="shadow-xl border-t-4 border-t-blue-500 rounded-md overflow-hidden">
            <CardHeader className="border-b bg-white sticky top-0 z-10 pb-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    Orders Management
                  </CardTitle>
                  <div className="flex gap-2 flex-col md:flex-row">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-8 w-full md:w-[200px]"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={clearSearch}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-sm">
                    Showing {orders.length} of {totalOrders} orders
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Package className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {searchTerm || statusFilter !== "All"
                      ? "Try adjusting your search or filter to find what you're looking for."
                      : "There are no orders to display yet."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("orderId")}
                              className="flex items-center gap-1"
                            >
                              Order ID
                              <ArrowUpDown className="h-3 w-3 text-gray-500" />
                            </Button>
                          </TableHead>
                          <TableHead className="font-semibold">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("createdAt")}
                              className="flex items-center gap-1"
                            >
                              Date
                              <ArrowUpDown className="h-3 w-3 text-gray-500" />
                            </Button>
                          </TableHead>
                          <TableHead className="font-semibold">
                            Payment
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("totalAmount")}
                              className="flex items-center gap-1"
                            >
                              Amount
                              <ArrowUpDown className="h-3 w-3 text-gray-500" />
                            </Button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow
                            key={order._id}
                            className="hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <TableCell
                              className="font-medium"
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                            >
                              {order.orderId}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {order?.userId?.firstName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {order?.userId?.email}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {order?.userId?.phone}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                            >
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                              className="uppercase font-medium"
                            >
                              {order.paymentMethod}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                              className="font-medium text-right"
                            >
                              ₹{order.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-4 p-4">
                    {orders.map((order) => (
                      <Collapsible key={order._id}>
                        <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-blue-50 transition-colors p-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="font-medium text-blue-800">
                                    {order.orderId}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(
                                      new Date(order.createdAt),
                                      "MMM dd, yyyy"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="space-y-4 pt-0 pb-4 px-4 bg-gray-50 border-t">
                              <div className="space-y-2 bg-white rounded-md p-3 shadow-sm">
                                <h4 className="font-medium text-gray-700">
                                  Customer
                                </h4>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">
                                    {order?.userId?.firstName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">
                                    {order.userId?.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">
                                    {order?.userId?.phone}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-white rounded-md p-3 shadow-sm">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  Delivery Address
                                </h4>
                                <div className="text-sm space-y-1 text-muted-foreground">
                                  <p>{order.deliveryAddress.fullname}</p>
                                  <p>{order.deliveryAddress.buildingname}</p>
                                  <p>{order.deliveryAddress.address}</p>
                                  <p>
                                    {order.deliveryAddress.city},{" "}
                                    {order.deliveryAddress.state}
                                  </p>
                                  <p>{order.deliveryAddress.pincode}</p>
                                </div>
                              </div>

                              <div className="bg-white rounded-md p-3 shadow-sm">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                                  <Package className="h-4 w-4 text-blue-500" />
                                  Order Details
                                </h4>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <span className="font-medium uppercase">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-medium">
                                      ₹{order.totalAmount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span className="font-medium">
                                      {order.items.length} items
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="p-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                currentPage > 1 && paginate(currentPage - 1)
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => paginate(i + 1)}
                                isActive={currentPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                currentPage < totalPages &&
                                paginate(currentPage + 1)
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
