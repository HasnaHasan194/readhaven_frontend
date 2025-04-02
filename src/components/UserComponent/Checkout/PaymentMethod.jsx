import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, BanknoteIcon } from "lucide-react";
import PropTypes from "prop-types";


export default function PaymentMethods({
  selectedPayment,
  setSelectedPayment,
  total,
  walletBalance
}) {
  
  const isWalletDisabled = walletBalance < total;
  const isCodDisabled = total > 1000;


  // Handle payment method selection
  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPayment}
          onValueChange={handlePaymentChange}
          className="space-y-4"
        >        
          {/* Cash on Delivery */}
          <div
            className={`flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted ${
              isCodDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RadioGroupItem value="cod" id="cod" disabled={isCodDisabled} />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BanknoteIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cod" className="font-medium">
                  Cash on Delivery
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay when you receive
                </p>
                {isCodDisabled && (
                  <span className="text-xs inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    COD is not available for purchase greater than 1000
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Online Payment */}
          <div className="flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted">
            <RadioGroupItem value="online" id="online" />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="online" className="font-medium">
                  Online Payment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay securely with your card
                </p>
              </div>
            </div>
          </div>

         {/* Wallet Payment */}
         <div
            className={`flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted ${
              isWalletDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RadioGroupItem value="wallet" id="wallet" disabled={isWalletDisabled} />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wallet" className="font-medium">
                  Wallet Payment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay using your wallet
                </p>
                <p className="text-xs text-muted-foreground">Wallet Balance ={walletBalance}</p>
                {isWalletDisabled && (
                  <span className="text-xs inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Insufficient Balance
                  </span>
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
PaymentMethods.PropTypes ={
  selectedPayment :PropTypes.string,
  setSelectedPayment :PropTypes.string,
  total :PropTypes.number,
  walletBalance :PropTypes.number,
}
