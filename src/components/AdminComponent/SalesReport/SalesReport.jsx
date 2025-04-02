import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  CreditCard,
  Wallet,
  BookOpen,
  Percent,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/api/User/axios";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import {
  downloadSalesReportExcel,
  downloadSalesReportpdf,
} from "@/api/Admin/salesReportApi";

// helper functions to compute date range
const calculateDateRange = (filter) => {
  const today = new Date();
  switch (filter) {
    case "today":
      return { from: startOfDay(today), to: endOfDay(today) };
    case "week":
      return { from: startOfWeek(today), to: endOfWeek(today) };
    case "month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "year":
      return { from: startOfYear(today), to: endOfYear(today) };
    default:
      return { from: null, to: null };
  }
};

export default function BookSalesReport() {
  const [filter, setFilter] = useState("today");

  const [date, setDate] = useState(calculateDateRange("today"));

  const [customDate, setCustomDate] = useState({ from: null, to: null });

  // Pagination and report state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [orders, setOrders] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalDiscount: 0,
    totalBooks: 0,
  });
  const [paymentMethods, setPaymentMethods] = useState({});
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (filter !== "custom") {
      const computed = calculateDateRange(filter);
      setDate(computed);
    }
  }, [filter]);

  // fetch sales report data when date, pagination, or filter change
  useEffect(() => {
    if (!date.from || !date.to) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: date.from.toISOString(),
          endDate: date.to.toISOString(),
          page: currentPage,
          limit: itemsPerPage,
          filter,
        });
        const response = await axiosInstance.get(
          `/admin/sales-report?${params}`
        );
        const data = response.data;
        console.log("Book Sales Report Data:", data);
        setOrders(data.report.data);
        setSummaryData(data.report.summary);
        setPaymentMethods(data.report.paymentMethods);
        setTotalOrdersCount(data.report.summary.totalOrders);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [date, currentPage, itemsPerPage, filter]);

  const totalPages = Math.ceil(totalOrdersCount / itemsPerPage);

  // Client-side filtering based on search term
  const displayedOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.bookTitle &&
          order.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };
  const goToFirstPage = () => goToPage(1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToLastPage = () => goToPage(totalPages);

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Function to handle PDF download
  const handleDownloadPdf = async () => {
    try {
      const params = new URLSearchParams({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        filter,
      });
      // Call the API function from the separate file
      const blob = await downloadSalesReportpdf(params.toString());
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "book_sales_report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  //handle download excel
  const handleDownloadExcel = async () => {
    try {
      const params = new URLSearchParams({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        filter,
      });
      const blob = await downloadSalesReportExcel(params.toString());
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "book_sales_report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  return (
    <div className="p-4 md:p-6 md:ml-64 lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Books Sales Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor your book sales performance and trends
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* Date Filter Dropdown */}
          <Select value={filter} onValueChange={(val) => setFilter(val)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Date Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {/* Custom Date Picker (only shown when filter is "custom") */}
          {filter === "custom" && (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[240px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate.from ? (
                      customDate.to ? (
                        <>
                          {format(customDate.from, "LLL dd, yyyy")} -{" "}
                          {format(customDate.to, "LLL dd, yyyy")}
                        </>
                      ) : (
                        format(customDate.from, "LLL dd, yyyy")
                      )
                    ) : (
                      <span>Select Custom Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <Calendar
                    mode="range"
                    selected={customDate}
                    onSelect={setCustomDate}
                    numberOfMonths={2}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setCustomDate({ from: null, to: null })}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => {
                        if (customDate.from && customDate.to) {
                          // Update the main date state
                          setDate({ from: customDate.from, to: customDate.to });
                          // Update URL search params so the backend receives the custom dates
                          const params = new URLSearchParams(
                            window.location.search
                          );
                          params.set(
                            "startDate",
                            customDate.from.toISOString()
                          );
                          params.set("endDate", customDate.to.toISOString());
                          params.set("filter", "custom");
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Export Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleDownloadExcel} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryData.totalOrders}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Books Sold
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryData.totalBooks || summaryData.totalOrders}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{summaryData.totalSales.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Discount
                </CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{summaryData.totalDiscount.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recently Sold Books</CardTitle>
              <CardDescription>
                The 10 most recent book orders from your store
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="space-y-4 overflow-x-auto">
                <div className="min-w-[600px]">
                  {orders.slice(0, 10).map((order) => (
                    <div
                      key={order.orderId}
                      className="flex items-center justify-between p-4 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.orderId} •{" "}
                            {format(
                              new Date(order.orderedDate),
                              "MMM dd, yyyy"
                            )}
                          </p>
                          <p className="text-sm text-blue-600">
                            {order.bookTitle || "Book Order"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-medium">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <UIBadge
                          variant={
                            order.paymentStatus === "paid"
                              ? "success"
                              : "outline"
                          }
                        >
                          {order.paymentStatus}
                        </UIBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {displayedOrders.length
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to{" "}
                {Math.min(currentPage * itemsPerPage, displayedOrders.length)}{" "}
                of {displayedOrders.length} entries
              </div>
              <div className="flex items-center gap-1">
                <div className="hidden md:flex items-center mr-2 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Detailed Reports Tab */}
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Book Sales Report</CardTitle>
              <CardDescription>
                Comprehensive view of all book orders and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID, customer or book title..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Coupon</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedOrders.length > 0 ? (
                        displayedOrders.map((order) => (
                          <TableRow key={order.orderId}>
                            <TableCell className="font-medium">
                              {order.orderId}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(order.orderedDate),
                                "MMM dd, yyyy"
                              )}
                            </TableCell>
                            <TableCell>{order.userName}</TableCell>
                            <TableCell>{order.bookTitle || "Book"}</TableCell>
                            <TableCell>{order.format || "Paperback"}</TableCell>
                            <TableCell>
                              {order.totalQuantity ||
                                order.items?.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0
                                ) ||
                                1}
                            </TableCell>
                            <TableCell>
                              ₹{order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ₹{order.discountAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {order.couponCode ? (
                                <UIBadge variant="outline">
                                  {order.couponCode}
                                </UIBadge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <UIBadge
                                variant={
                                  order.paymentStatus === "paid"
                                    ? "success"
                                    : "outline"
                                }
                              >
                                {order.paymentStatus}
                              </UIBadge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {displayedOrders.length
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to{" "}
                {Math.min(currentPage * itemsPerPage, displayedOrders.length)}{" "}
                of {totalOrdersCount} entries
              </div>
              <div className="flex items-center gap-1">
                <div className="hidden md:flex items-center mr-2 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">COD</CardTitle>
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-purple-100">
                  Cash On Delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  ₹{(paymentMethods["cod"] || 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {summaryData.totalSales
                    ? (
                        ((paymentMethods["cod"] || 0) /
                          summaryData.totalSales) *
                        100
                      ).toFixed(1)
                    : 0}
                  % of total sales
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Online</CardTitle>
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-blue-100">
                  Online payments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  ₹{(paymentMethods["online"] || 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {summaryData.totalSales
                    ? (
                        ((paymentMethods["online"] || 0) /
                          summaryData.totalSales) *
                        100
                      ).toFixed(1)
                    : 0}
                  % of total sales
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Wallet</CardTitle>
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-green-100">
                  Wallet payments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  ₹{(paymentMethods["wallet"] || 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {summaryData.totalSales
                    ? (
                        ((paymentMethods["wallet"] || 0) /
                          summaryData.totalSales) *
                        100
                      ).toFixed(1)
                    : 0}
                  % of total sales
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>
                Analysis of payment methods used for book purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-around p-4">
                {Object.entries(paymentMethods).map(([method, amount]) => {
                  const percentage = summaryData.totalSales
                    ? (amount / summaryData.totalSales) * 100
                    : 0;
                  return (
                    <div
                      key={method}
                      className="flex flex-col items-center mb-4 md:mb-0"
                    >
                      <div className="text-lg font-medium capitalize">
                        {method}
                      </div>
                      <div className="text-3xl font-bold mt-2">
                        ₹{amount.toFixed(2)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            method === "cod"
                              ? "bg-indigo-600"
                              : method === "online"
                              ? "bg-blue-600"
                              : "bg-green-600"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
