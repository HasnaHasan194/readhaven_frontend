import { useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';

export default function OrderFailurePage() {
  const navigate = useNavigate();

  const checkPaymentStatus = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status === 'success') {
      navigate('/order-success');
    }
  }, [navigate]);

  const getOrderIdFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderId');
  }, []);

  const retryPayment = useCallback(() => {
    const orderId = getOrderIdFromUrl();
    navigate("/orders")
  }, [getOrderIdFromUrl, navigate]);

  useEffect(() => {
    checkPaymentStatus();
    // Add analytics/error logging here
    console.log('Payment failed for order:', getOrderIdFromUrl());
  }, [checkPaymentStatus, getOrderIdFromUrl]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-[600px] w-full mx-4">
        {/* Failure Illustration */}
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
          We're sorry, your payment could not be processed. Please check your payment details and try again,
          or visit your order details page to review your order.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            variant="destructive"
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate('/')}
          >
           Back to home
          </Button>
          
          <Button
            variant="success"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <Link to={"/orders"}>
              View Orders
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}