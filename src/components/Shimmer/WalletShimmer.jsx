import React from "react";
import { cn } from "@/lib/utils"; // Assuming this is your utility for classNames

export default function WalletShimmer() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="bg-white border-black border shadow-lg rounded-lg animate-pulse">
        {/* Card Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="h-8 w-1/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>

        {/* Balance Section */}
        <div className="bg-black text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
              <div className="h-10 w-32 bg-gray-400 rounded"></div>
            </div>
            <div>
              <div className="h-10 w-24 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-4">
          <div className="h-6 w-36 bg-gray-300 rounded mb-4"></div>

          {/* Transaction Items */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-gray-200">
                    <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  </div>
                  <div>
                    <div className="h-4 w-40 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="flex items-center justify-end gap-1">
                    <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}