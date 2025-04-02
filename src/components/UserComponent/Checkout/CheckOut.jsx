import { useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import DeliveryAddress from "./DeliveryAddress";
import PaymentMethods from "./PaymentMethod";
import PaymentSummary from "./PaymentSummary";
import { proceedToCheckout } from "@/api/User/cartApi";
import { getAddresses } from "@/api/User/addressApi";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/api/User/profileApi";
import { toast } from "react-toastify";
import { placeOrder } from "@/api/User/orderApi";
import OrderSuccessPage from "../Order/OrderSuccessPage";
import { deductWallet } from "@/api/User/walletApi";
import CouponSelection from "./CouponSelection";
import { Currency } from "lucide-react";
import { PaymentComponent } from "@/components/payment-components/Razorpay";
import OrderFailurePage from "../Order/OrderFailure";

export default function CheckOut() {
  // State for selected address & payment
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [selectedPayment, setSelectedPayment] = useState("online");
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState();
  const [orderSucces, setOrderSuccess] = useState(false);
  const [orderFailure, setOrderFailure] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [usedCoupons, setUsedCoupons] = useState([]);
  const [walletBalancein , setWalletBalancein]=useState(null)

  //to get the balance
  const fetchUsedCoupons = async () => {
    try {
      const response = await getUserProfile();
      setUsedCoupons(response.userDetails.usedCoupons);
      setWalletBalancein(response.userDetails.balance);
    } catch (error) {
      console.log("Error in fetching the used coupons", error);
    }
  };

  //to get addresses
  const fetchAddresses = async () => {
    try {
      const addressResponse = await getAddresses();
      const isDefaultAddress = addressResponse.addresses.find(
        (x) => x.isDefault
      );
      setAddresses(addressResponse.addresses);
      setSelectedAddressIndex(isDefaultAddress);
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  //to get cart items
  const fetchCartProducts = async () => {
    try {
      const productsResponse = await proceedToCheckout();
      console.log("Product response :", productsResponse);
      setProducts(productsResponse.cart.items || []);
      setWalletBalancein(productsResponse.walletBalance );
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCartProducts();
    fetchUsedCoupons();
  }, []);

  //Calculate subtotal,tax,total
  const subtotal = products.reduce((total, item) => {
    return total + item.price * item.quantity; // or use `item.product.salePrice` if that's what you need
  }, 0);

  //calculate discount from coupon
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minimumPurchase) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === "amount") {
      discountAmount = appliedCoupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotal);
  }

  const tax = subtotal * 0.12;
  const total = Math.round(subtotal - discountAmount + tax);

  //to handle coupons
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  //handler to place order
  const handlePlaceOrder = async (PaymentResponse) => {
    const selectedAddressObj = addresses.find(
      (addr) => addr._id === selectedAddress
    );
    if (!selectedAddressObj) {
      toast.error("Please selece a valid address to continue");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please selecet a payment method");
      return;
    }

    if (selectedPayment === "cod") {
      const orderData = {
        paymentMethod: selectedPayment,
        deliveryAddress: selectedAddressObj,
        subtotal: subtotal,
        tax: tax,
        discountAmount: discountAmount,
        totalAmount: total,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };

      try {
        const response = await placeOrder(orderData);
        toast.success(response.message);
        setOrderDetails(response.newOrder);
        setOrderSuccess(true);
      } catch (error) {
        toast.error(error?.message);
        console.log(error);
      }
    } else if (selectedPayment === "wallet") {
      if (walletBalancein < total) {
        toast.error("Insufficient wallet balance");
        return;
      }
      try {
        const walletResponse = await deductWallet({
          amount: total,
          description: `Payment for order ${selectedAddressObj._id}`,
        });
        if (!walletResponse.success) {
          toast.error(walletResponse.message);
          return;
        }
        const orderData = {
          paymentMethod: selectedPayment,
          deliveryAddress: selectedAddressObj,
          subtotal: subtotal,
          tax: tax,
          discountAmount: discountAmount,
          totalAmount: total,
          paymentStatus: "paid",
        };
        const response = await placeOrder(orderData);
        toast.success(response.message);
        setOrderDetails(response.newOrder);
        setOrderSuccess(true);
      } catch (error) {
        toast.error(error?.message);
        console.log(error);
      }
    }
    //if online payment integrate razorpay
    else if (selectedPayment === "online") {
      console.log("okayyyyy");
      let orderData = null
      let success = null
      if (PaymentResponse.success) {
        orderData = {
          paymentMethod: selectedPayment,
          deliveryAddress: selectedAddressObj,
          subtotal: subtotal,
          tax: tax,
          discountAmount: discountAmount,
          transactionId: PaymentResponse.razorpay_payment_id,
          paymentStatus: "Paid",
          totalAmount: total,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        };
        success = true
      } else if (!PaymentResponse.success) {
        orderData = {
          paymentMethod: selectedPayment,
          deliveryAddress: selectedAddressObj,
          subtotal: subtotal,
          tax: tax,
          discountAmount: discountAmount,
          transactionId: PaymentResponse.razorpay_payment_id,
          paymentStatus: "Failed",
          totalAmount: total,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        };
        success = false
      }
      try {
        const response = await placeOrder(orderData);
        toast.success(response.message);
        setOrderDetails(response.newOrder);
        if (success == true) {
          setOrderSuccess(true);
        } else if (success == false) {
          setOrderFailure(true)
        }
      } catch (error) {
        toast.error(error?.message);
        console.log(error);
      }
    }
  };

  // If order is successful, show the OrderSuccessPage component with order details
  if (orderSucces && orderDetails) {
    return (
      <OrderSuccessPage
        orderDetails={orderDetails}
        discountAmount={discountAmount}
      />
    );
  }

  if (orderFailure && orderDetails) {
    return (
      <OrderFailurePage
        orderDetails={orderDetails}
        discountAmount={discountAmount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        {/* Main Grid: 2 columns on large screens, 1 column on small */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Order Summary + Delivery Address */}
          <div className="space-y-6 lg:col-span-2">
            <OrderSummary products={products} />
            <DeliveryAddress
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              selectedAddressIndex={selectedAddressIndex}
              fetchAddresses={fetchAddresses}
            />
          </div>

          {/* Right Column: Payment Methods + Payment Summary */}
          <div className="space-y-6">
            <CouponSelection
              subTotal={subtotal}
              applyCoupon={handleApplyCoupon || []}
              usedCoupons={usedCoupons}
            />

            <PaymentMethods
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              walletBalance={walletBalancein}
              total={total}
            />
            <PaymentSummary
              subtotal={subtotal}
              discount={discountAmount}
              tax={tax}
              total={total}
            />

            {selectedPayment == "online" ? (
              <PaymentComponent
                total={total}
                handlePlaceOrder={handlePlaceOrder}
              />
            ) : (
              <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                Place Order Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
