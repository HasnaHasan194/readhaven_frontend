import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-center text-black">READ HAVEN</h1>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          © 2023 READHAVEN. All rights reserved.
        </p>
      </footer>
    </div>
  );
}