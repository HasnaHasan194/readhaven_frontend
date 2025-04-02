import { getWalletData } from "@/api/User/walletApi";
import WalletShimmer from "@/components/Shimmer/WalletShimmer";
import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import Wallet from "@/components/UserComponent/Wallet/Wallet";
import React, { useEffect, useState } from "react";
export const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    pagination: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getWalletData(page);

      console.log("1234567890", data);

      if (!data.success) {
        throw new Error("Failed to fetch wallet data");
      }

      setWalletData({
        balance: data.balance,
        transactions: data.transactions,
        pagination: data.pagination, // Assuming API returns { total, totalPages, from, to }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (amount) => {
    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to deposit funds");
      }

      // Refresh wallet data after successful deposit
      fetchWalletData();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar />
        <main className="flex-1 overflow-auto p-4">
          {loading ? (
            <WalletShimmer />
          ) : (
            <Wallet
              walletData={walletData}
              onDeposit={handleDeposit}
              onPageChange={fetchWalletData}
            />
          )}
        </main>
      </div>
    </div>
  );
};
