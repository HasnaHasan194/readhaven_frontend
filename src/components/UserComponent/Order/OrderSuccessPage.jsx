import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage({ orderDetails, discountAmount }) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 overflow-hidden">
        {/* Success Banner */}
        <div className="bg-emerald-600 text-white p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          </div>
          <p className="text-center text-emerald-100">Your order has been successfully placed and is being processed.</p>
        </div>
        
        <CardContent className="p-8">
          {/* Order ID and Date Banner */}
          <div className="bg-gray-100 rounded-lg p-4 mb-8 flex flex-wrap justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold">{orderDetails.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Expected</p>
              <p className="font-medium text-emerald-600">{new Date(orderDetails.deliveryDate).toLocaleDateString("en-GB")}</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div>
              {/* Delivery Address */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </span>
                  Delivery Address
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">{orderDetails.deliveryAddress.fullname}</p>
                  <p className="text-gray-700 mt-1">{orderDetails.deliveryAddress.buildingname}, {orderDetails.deliveryAddress.address}</p>
                  <p className="text-gray-700">{orderDetails.deliveryAddress.district}</p>
                  <p className="text-gray-700">{orderDetails.deliveryAddress.state} - {orderDetails.deliveryAddress.pincode}</p>
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </span>
                  Payment Information
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium uppercase">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${orderDetails.paymentStatus.toLowerCase() === "paid" ? "text-emerald-600" : "text-red-600"}`}>
                      {orderDetails.paymentStatus}
                    </span>
                  </div>
                  {orderDetails.transactionId && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Transaction ID:</p>
                      <p className="font-mono text-sm">{orderDetails.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </span>
                  Order Summary
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-emerald-600">-₹{discountAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{orderDetails.tax.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-bold">Total</span>
                      <span className="font-bold text-gray-900">₹{orderDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={() => navigate("/orders")} 
              className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300" 
              variant="outline"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Button>
            <Button 
              onClick={() => navigate("/shop-all")} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}