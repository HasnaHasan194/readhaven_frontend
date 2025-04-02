import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";

export function RetryComponent({ updatePaymentStatus, total }) {
  const handleSubmit = async () => {
    var options = {
      key: "rzp_test_ZULLnbg25QCQyN",
      key_secret: "6UC6lmDY2scOmHXz1kbeMFXe",
      amount: total * 100,
      currency: "INR",
      name: "READHAVEN",
      description: "READHAVEN E-COMMERCE PAYMENT TESTING",
      handler: function (response) {
        let payment_status = "Paid";

        updatePaymentStatus(payment_status);
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
          let payment_status = "Failed";

          updatePaymentStatus(payment_status);
        },
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    // <div>
    //   <button
    //     onClick={handleSubmit}
    //     className="bg-black text-white mt-4 w-full h-16 rounded-md"
    //   >
    //     Retry Payment with RazorPay
    //   </button>
    // </div>
    <div className="w-full max-w-md mx-auto p-4">
    <button
      onClick={handleSubmit}
      className="w-full h-12 bg-black text-white rounded-lg mt-4 
                 hover:bg-gray-900 focus:outline-none focus:ring-2 
                 focus:ring-gray-500 focus:ring-offset-2 
                 transition-colors duration-200 font-medium"
    >
      Retry Payment with RazorPay
    </button>
  </div>
  );
}
// return (
//   <div className="w-full max-w-md mx-auto p-4">
//     <button
//       onClick={handleSubmit}
//       className="w-full h-12 bg-black text-white rounded-lg mt-4 
//                  hover:bg-gray-900 focus:outline-none focus:ring-2 
//                  focus:ring-gray-500 focus:ring-offset-2 
//                  transition-colors duration-200 font-medium"
//     >
//       Retry Payment with RazorPay
//     </button>
//   </div>
// );

