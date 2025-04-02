import React, { useEffect } from "react";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function Wallet({ walletData, onDeposit, onPageChange }) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // These would come from your API with proper pagination
  const { balance, transactions, pagination } = walletData;

  const handleDeposit = () => {
    const amount = Number.parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      onDeposit(amount);
      setDepositAmount("");
      setIsDepositModalOpen(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page); // Call the fetch function with new page
  };

  useEffect(() => {
    if (pagination?.currentPage && pagination.currentPage !== currentPage) {
      setCurrentPage(pagination.currentPage);
    }
  }, [pagination]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Card className="bg-white border-black border shadow-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold">Digital Wallet</CardTitle>
          <CardDescription>Manage your finances with ease</CardDescription>
        </CardHeader>

        <div className="bg-black text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Current Balance
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
              ₹{balance.toFixed(2)}
              </h2>
            </div>
   
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-full p-2",
                        transaction.transactionType === "Credit"
                          ? "bg-gray-100 text-black"
                          : "bg-black text-white"
                      )}
                    >
                      {transaction.transactionType === "Credit" ? (
                        <ArrowDownCircle className="h-5 w-5" />
                      ) : (
                        <ArrowUpCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(transaction.transactionDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-bold",
                        transaction.transactionType === "Credit"
                          ? "text-black"
                          : "text-gray-700"
                      )}
                    >
                      {transaction.transactionType === "Credit" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {transaction.transactionStatus === "Pending" && (
                        <Clock className="h-3 w-3 text-yellow-500" />
                      )}
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          transaction.transactionStatus === "Success" &&
                            "bg-gray-100 text-gray-800",
                          transaction.transactionStatus === "Pending" &&
                            "bg-yellow-100 text-yellow-800",
                          transaction.transactionStatus === "Failed" &&
                            "bg-red-100 text-red-800"
                        )}
                      >
                        {transaction.transactionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination - assumes backend pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{pagination.from}</span>{" "}
                to <span className="font-medium">{pagination.to}</span> of{" "}
                <span className="font-medium">{pagination.total}</span>{" "}
                transactions
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>

                {/* Pagination buttons */}
                <div className="flex items-center">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, i, array) => {
                      if (i > 0 && array[i - 1] !== page - 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="px-2">...</span>
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                currentPage === page
                                  ? "bg-black text-white hover:bg-black/90"
                                  : ""
                              )}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            currentPage === page
                              ? "bg-black text-white hover:bg-black/90"
                              : ""
                          )}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you want to deposit to your wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleDeposit}
              disabled={!depositAmount || Number.parseFloat(depositAmount) <= 0}
            >
              Add Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
