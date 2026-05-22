import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { RetryComponent } from "@/components/payment-components/RazorpayRetry";
import axiosInstance from "@/api/User/axios";
import { toast } from "react-toastify";

export default function OrderFailurePage({ orderDetails }) {
  const navigate = useNavigate();

  const checkPaymentStatus = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "success") {
      navigate("/order-success");
    }
  }, [navigate]);

  const getOrderIdFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("orderId");
  }, []);

  const handleUpdatePaymentStatus = async (status) => {
    const orderId = orderDetails?.orderId || getOrderIdFromUrl();
    if (!orderId) return;

    try {
      const response = await axiosInstance.put(
        `/users/orders/${orderId}/payment-status`,
        { status }
      );

      if (status?.toLowerCase() === "paid") {
        toast.success(response.data?.message || "Payment successful.");
        const firstItemId = orderDetails?.items?.[0]?._id;
        if (firstItemId) {
          navigate(`/orders/${orderId}/item/${firstItemId}`);
        } else {
          navigate(`/orders/${orderId}`);
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update payment status"
      );
    }
  };

  useEffect(() => {
    checkPaymentStatus();
    console.log(
      "Payment failed for order:",
      orderDetails?.orderId || getOrderIdFromUrl()
    );
  }, [checkPaymentStatus, getOrderIdFromUrl, orderDetails?.orderId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-[600px] w-full mx-4">
        <div className="flex justify-center mb-8">
          <svg
            className="w-48 h-48 text-gray-900 dark:text-gray-100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Payment Failed!
        </h1>

        <p className="text-lg text-center mb-8 text-gray-600 dark:text-gray-300">
          We&apos;re sorry, your payment could not be processed. Please try again
          below or visit your order details to review your order.
        </p>

        {orderDetails && (
          <div className="mb-8">
            <RetryComponent
              total={orderDetails.totalAmount}
              updatePaymentStatus={handleUpdatePaymentStatus}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            variant="destructive"
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>

          <Button
            variant="success"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <Link to="/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
