import { useState, useEffect } from "react"
import {
  PlusCircle,
  Search,
  ArrowUpDown,
  Calendar,
  Tag,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { blockCoupon, getCoupons } from "@/api/Admin/couponApi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
 
export default function CouponList() {
  const [coupons, setCoupons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate();

  // Function to add notifications
  const addNotification = (type, title, message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, title, message }])
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 5000)
  }

  // Function to dismiss notifications
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  useEffect(() => {
    const fetchCoupons = async() => {
      setIsLoading(true)
      try {
        const response = await getCoupons();
        setCoupons(response.coupons)
        console.log(response)
      }
      catch(error) {
        console.log("Error in fetching coupons", error)
        addNotification("error", "Error", error?.message || "Failed to fetch coupons")
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchCoupons()
  }, []);
 
  const handleToggle = async(id) => {
    try {
      const response = await blockCoupon(id);
      addNotification("success", "Success", response.message);

      // Update the UI immediately
      setCoupons(prevCoupons =>
        prevCoupons.map(coupon =>
          coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
        )
      );
    }
    catch(error) {
      addNotification("error", "Error", error?.message || "Failed to update coupon status");
      console.log("Error in updating the status", error);
    }
  }

  const filteredCoupons = coupons.filter((coupon) => {
    // Filter by search term
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && coupon.isActive
    if (activeTab === "inactive")
      return matchesSearch && (!coupon.isActive)

    return matchesSearch
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const isExpiringSoon = (dateString) => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 7
  }

  const getStatusBadge = (coupon) => {
    if (!coupon.isActive) {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Disabled
        </Badge>
      )
    }

    if (coupon.status === "expired") {
      return <Badge variant="destructive">Expired</Badge>
    }

    if (coupon.status === "exhausted") {
      return <Badge variant="destructive">Exhausted</Badge>
    }

    if (isExpiringSoon(coupon.expiryDate)) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
          Expiring Soon
        </Badge>
      )
    }

    if (coupon.usageCount >= coupon.usageLimit * 0.9) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
          Almost Exhausted
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">
        Active
      </Badge>
    )
  }

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === "percentage") {
      return (
        <div className="flex items-center">
          <span>{coupon.discountValue}%</span>
        </div>
      )
    } else if (coupon.discountType === "amount") {
      return (
        <div className="flex items-center">
          <span>₹{coupon.discountValue}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-primary" />
          <span>Free Shipping</span>
        </div>
      )
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="ml-64 max-w-[calc(100%-16rem)] mx-auto py-8 px-4">
      {/* Notification container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {notifications.map((notification) => (
          <Alert 
            key={notification.id} 
            className={`relative shadow-md animate-slideIn ${
              notification.type === 'error' ? 'border-red-500 bg-red-50' : 
              notification.type === 'success' ? 'border-green-500 bg-green-50' : 
              'border-amber-500 bg-amber-50'
            }`}
          >
            <div className="flex gap-2">
              {getNotificationIcon(notification.type)}
              
              <div className="flex-1">
                <AlertTitle>{notification.title}</AlertTitle>
                <AlertDescription>{notification.message}</AlertDescription>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6 p-0" 
                onClick={() => dismissNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>
      
      <div className="flex flex-col space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
          <Button
            onClick={() => navigate("/admin/add/coupon")} 
            className="bg-primary hover:bg-primary/90 transition-colors">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Coupon
          </Button>
        </div>

        {/* Filter section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50 p-4 rounded-lg shadow-sm">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all">All Coupons</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search coupons..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main content */}
        <Card className="overflow-hidden border rounded-lg shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p>Loading coupons...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-4 font-medium text-slate-700">SL No</th>
                    <th className="text-left p-4 font-medium text-slate-700">
                      <div className="flex items-center">
                        Code
                        <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium text-slate-700">Discount Type</th>
                    <th className="text-left p-4 font-medium text-slate-700">Discount</th>
                    <th className="text-left p-4 font-medium text-slate-700">
                      <div className="flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4 text-slate-500" />
                        Min Purchase
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium text-slate-700">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                        Expiry Date
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-center p-4 font-medium text-slate-700">Enable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCoupons.map((coupon, index) => (
                    <tr
                      key={coupon.id || index}
                      className={`hover:bg-slate-50 transition-colors ${!coupon.isActive ? "opacity-70" : ""}`}
                    >
                      <td className="p-4 text-slate-600">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-medium uppercase">{coupon.code}</div>
                      </td>
                      <td className="p-4 capitalize text-slate-600">{coupon.discountType}</td>
                      <td className="p-4 font-medium">{getDiscountDisplay(coupon)}</td>
                      <td className="p-4 text-slate-600">₹{coupon.minimumPurchase}</td>
                      <td className="p-4">
                        <div
                          className={`flex items-center ${
                            isExpiringSoon(coupon.expiryDate)
                              ? "text-amber-600 font-medium"
                              : new Date(coupon.expiryDate) < new Date()
                                ? "text-red-600"
                                : "text-slate-600"
                          }`}
                        >
                          {isExpiringSoon(coupon.expiryDate) && (
                            <AlertCircle className="h-4 w-4 mr-1" />
                          )}
                          {formatDate(coupon.expiryDate)}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(coupon)}</td>
                      <td className="p-4 text-center">
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={() => handleToggle(coupon._id)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredCoupons.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2 py-8">
                          <Search className="h-10 w-10 text-slate-300" />
                          <p className="text-lg font-medium text-slate-700">No coupons found</p>
                          <p className="text-slate-500">Try adjusting your search or create a new coupon.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}