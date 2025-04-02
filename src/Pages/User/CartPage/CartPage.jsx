import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import ShoppingCart from "@/components/UserComponent/Cart/Cart";
import Header from "@/components/UserComponent/LandingPage/Header";

import React from "react";

const CartPage = () => {
    return (
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-auto p-4">
              <ErrorBoundary>
              <ShoppingCart />
              </ErrorBoundary>
            </main>
          </div>
        </div>
      )
}

export default CartPage