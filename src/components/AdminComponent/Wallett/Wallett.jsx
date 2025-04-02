// import { getWalletTransactions } from '@/api/Admin/walletApi';
// import React, { useState, useEffect } from 'react';
// import { Wallet,RefreshCcw,CreditCard,ArrowUpRight,ChevronLeft,ChevronRight } from 'lucide-react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const WalletManagement = () => {
//   const navigate = useNavigate()
//   const [transactions, setTransactions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Placeholder navigation function
//   const navigateToOrder = (orderId) => {
//     alert(`Navigating to order ${orderId}`);
//   };

//   const fetchWalletTransactions = async () => {
//     try {
//       const response = await getWalletTransactions()
//       console.log(response)
//       setTransactions(response.walletTransactions)
//     } catch (error) {
//       alert(error?.message || "Failed to load the transactions")
//     }
//   };

//   useEffect(() => {
//      fetchWalletTransactions();
//   }, []);

//   const handleRefundOrder = (transaction) => {
//     const {description} = transaction;
//     if(description.includes("Refund")){

//        return description.split("Refund for order ")[1];

//     }
//     return false
//   }
  

//   //function to view order with wallet
// const handleRefundOrderdetails =(transaction)=>{
//   const description =transaction;
//   if(description.includes("Payment")){
//     return description.split("Payment for Order ")[1];
//   }
//   return false
// }



//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const totalPages = Math.ceil(transactions.length / itemsPerPage);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl ml-64">
//       <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Wallet className="text-white w-10 h-10" />
//             <h2 className="text-2xl font-bold text-white">Wallet Transactions</h2>
//           </div>
//           <button 
//             onClick={fetchWalletTransactions}
//             className="text-white hover:bg-white/20 p-2 rounded-full transition"
//           >
//             <RefreshCcw className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Transactions Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 {['Transaction ID', 'Date', 'User', 'Type', 'Amount', 'Actions'].map((header) => (
//                   <th 
//                     key={header} 
//                     className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {currentTransactions.map((transaction, index) => (
//                 <tr 
//                   key={index} 
//                   className="hover:bg-gray-50 transition duration-150 border-b last:border-b-0"
//                 >
//                   <td className="p-4 text-sm text-gray-700">
//                     <div className="flex items-center">
//                       <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
//                       {transaction.transactionId}
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-gray-600">
//                     {formatDate(transaction.transactionData)}
//                   </td>
//                   <td className="p-4 text-sm text-gray-700">{transaction.user}</td>
//                   <td className="p-4">
//                     <span 
//                       className={`
//                         px-3 py-1 rounded-full text-xs font-medium
//                         ${transaction.transactionType === 'Credit' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                         }
//                       `}
//                     >
//                       {transaction.transactionType}
//                     </span>
//                   </td>
//                   <td className="p-4 text-sm font-semibold text-gray-800">
//                     ${transaction.amount.toFixed(2)}
//                   </td>
//                   <td className="p-4">
//                     {handleRefundOrder(transaction) && (
//                       <button 
//                         onClick={() => navigate(`/admin/orders/${handleRefundOrder(transaction)}`)}
//                         className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
//                       >
//                         <span>View Order</span>
//                         <ArrowUpRight className="w-4 h-4" />
//                       </button>
//                     )}
//                     {handleRefundOrderdetails(transaction) && (
//                       <button 
//                         onClick={() => navigate(`/admin/orders/${handleRefundOrder(transaction)}`)}
//                         className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
//                       >
//                         <span>View Order</span>
//                         <ArrowUpRight className="w-4 h-4" />
//                       </button>
//                     )}
                    
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* No Transactions State */}
//           {transactions.length === 0 && (
//             <div className="text-center py-10 text-gray-500">
//               No transactions found
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {transactions.length > 0 && (
//           <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <button 
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//               >
//                 <ChevronLeft />
//               </button>

//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => paginate(i + 1)}
//                   className={`w-10 h-10 rounded-lg ${
//                     currentPage === i + 1 
//                       ? 'bg-blue-500 text-white' 
//                       : 'hover:bg-gray-200'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button 
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//               >
//                 <ChevronRight />
//               </button>
//             </div>

//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <select 
//                 value={itemsPerPage} 
//                 onChange={(e) => {
//                   setItemsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="border rounded-lg px-2 py-1 text-sm"
//               >
//                 {[5, 10, 20, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WalletManagement;
import { getWalletTransactions } from '@/api/Admin/walletApi';
import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCcw, CreditCard, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WalletManagement = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchWalletTransactions = async () => {
    try {
      const response = await getWalletTransactions();
      console.log(response);
      setTransactions(response.walletTransactions);
    } catch (error) {
      alert(error?.message || "Failed to load the transactions");
    }
  };

  useEffect(() => {
    fetchWalletTransactions();
  }, []);

  const handleRefundOrder = (transaction) => {
    const { description } = transaction;
    if (description.includes("Refund")) {
      return description.split("Refund for order ")[1];
    }
    return false;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl ml-64">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Wallet className="text-white w-10 h-10" />
            <h2 className="text-2xl font-bold text-white">Wallet Transactions</h2>
          </div>
          <button 
            onClick={fetchWalletTransactions}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['Transaction ID', 'Date', 'User', 'Type', 'Amount', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 transition duration-150 border-b last:border-b-0"
                >
                  <td className="p-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                      {transaction.transactionId}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(transaction.transactionData)}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{transaction.user}</td>
                  <td className="p-4">
                    <span 
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${transaction.transactionType === 'Credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}
                    >
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    {handleRefundOrder(transaction) && (
                      <button 
                        onClick={() => navigate(`/admin/orders/${handleRefundOrder(transaction)}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
                      >
                        <span>View Order</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No transactions found
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === i + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManagement;
 