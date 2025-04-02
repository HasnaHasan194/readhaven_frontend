import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";

export function PaymentComponent({handlePlaceOrder, total, }) {
  const handleSubmit = async () => {
    var options = {
      key: "rzp_test_ZULLnbg25QCQyN",
      key_secret: "6UC6lmDY2scOmHXz1kbeMFXe",
      amount: total * 100,
      currency: "INR",
      name: "READHAVEN",
      description: "READHAVEN E-COMMERCE PAYMENT TESTING",
      handler: function (response) {
        console.log("Payment successful");
        let payment_status = "Paid";

        handlePlaceOrder({...response, success: true});
      },
      prefill: {
        name: "Hasna",
        email: "hasna@gmail.com",
        contact: "8304944316",
      },
      notes: {
        address: "Razorpay Corporate office",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment failed or dismissed");
          let payment_status = "Failed";

          handlePlaceOrder({success : false});
        },
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div>
      <button
        onClick={handleSubmit}
        className="bg-black text-white mt-4 w-full h-16 rounded-md"
      >
        Pay with RazorPay and Place Order
      </button>
    </div>
  );
}

export default PaymentComponent;
