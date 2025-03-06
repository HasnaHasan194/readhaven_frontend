    import React, { useState, useEffect } from 'react';
    import { 
    Edit2, 
    Search, 
    CheckCircle, 
    XCircle, 
    ChevronLeft, 
    ChevronRight 
    } from "lucide-react";
    import { useNavigate } from 'react-router-dom';
    import { blockProduct, getProducts } from '@/api/Admin/productApi';
    import { toast } from 'react-toastify';

    const ProductList = () => {
    

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [confirmDialog, setConfirmDialog] = useState({ 
        open: false, 
        productId: null, 
        productName: "", 
        currentStatus: false 
    });
    const productsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts =async() => {
            try{
                const response = await getProducts(currentPage,productsPerPage);
                setProducts(response.products)
                setTotalPages(response.totalPages);
                setLoading(false)
                console.log(response)
            }
            catch(error){
            console.log(error)
            toast.error(error?.message)
            }
        }
        fetchProducts();
    }, [currentPage]);

    const openConfirmDialog = (productId, productName, currentStatus) => {
        setConfirmDialog({
        open: true,
        productId,
        productName,
        currentStatus
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, productId: null, productName: "", currentStatus: false });
    };
    const toggleProductStatus = async () => {
        try {
            if (!confirmDialog.productId) return;
    
            // Call API to block/unblock product
            const response = await blockProduct(confirmDialog.productId);
    
      
            toast.success(response.message);
    
            // Update product state after successful API call
            setProducts((prev) =>
                prev.map((product) =>
                    product._id === confirmDialog.productId
                        ? { ...product, isBlocked: !product.isBlocked }
                        : product
                )
            );
        } catch (error) {
            console.error("Error toggling product block status:", error);
            toast.error(error?.message);
        }
    
        closeConfirmDialog(); 
    };
    

    
    const AlertDialog = ({ open, onClose, onConfirm, title, description, confirmText, confirmClass }) => {
        if (!open) return null;
        
        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>
            <div className="flex justify-end space-x-2">
                <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                Cancel
                </button>
                <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmClass}`}
                >
                {confirmText}
                </button>
            </div>
            </div>
        </div>
        );
    };

    // Component for the switch toggle
    const Switch = ({ checked, onChange }) => {
        return (
        <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            checked ? 'bg-green-500' : 'bg-gray-300'
            }`}
            onClick={onChange}
        >
            <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                checked ? 'translate-x-6' : 'translate-x-1'
            }`}
            />
        </button>
        );
    };

    // Component for the button
    const Button = ({ children, onClick, disabled, variant = "default", className = "", size = "md", ...props }) => {
        const baseClass = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
        
        const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
        };
        
        const sizeClasses = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm"
        };
        
        const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
        
        return (
        <button
            className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
            <input 
                type="search" 
                placeholder="Search books..." 
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button onClick={()=>navigate("/admin/add/product")} className="w-full md:w-auto">
            Add New Book
            </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Sl No</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Image</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Name</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Published Date</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Writer</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Category</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Language</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Regular Price</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Offer</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Quantity</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Status</th>
                <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
    {loading ? (
        <tr>
            <td colSpan="12" className="px-6 py-4 text-center text-gray-500">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <div className="mt-2">Loading products...</div>
            </td>
        </tr>
    ) : products.length === 0 ? (
        <tr>
            <td colSpan="12" className="px-6 py-4 text-center text-gray-500">No products found</td>
        </tr>
    ) : (
        products.map((product, index) => (
            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {(currentPage - 1) * productsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                        <img 
                            src={product.productImages?.[0]} 
                            alt={product.name} 
                            className="h-16 w-12 object-cover rounded-md shadow-sm" 
                        />
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {new Date(product.publishedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.writer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {product.Category?.name || "No Category"}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.language}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">₹{Number(product.regularPrice).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {product.productOffer}%
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{product.availableQuantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    {!product.isBlocked ? (
                        <div className="flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <span className="ml-2 text-xs text-green-600 font-medium">Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="ml-2 text-xs text-red-600 font-medium">Blocked</span>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                        <Button 
                           onClick={() => navigate(`/admin/product/${product._id}`)}
                            variant="outline" 
                            size="sm" 
                            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Switch
                            checked={!product.isBlocked}
                            onChange={() => openConfirmDialog(product._id, product.name, !product.isBlocked)}
                        />
                    </div>
                </td>
            </tr>
        ))
    )}
</tbody>

            </table>
        </div>

        <div className="flex justify-between items-center mt-8">
            <Button 
            variant="outline" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-2"
            >
            <ChevronLeft className="h-5 w-5" /> 
            Previous
            </Button>
            <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-blue-600" : ""}
                >
                {page}
                </Button>
            ))}
            </div>
            <Button 
            variant="outline" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center gap-2"
            >
            Next
            <ChevronRight className="h-5 w-5" />
            </Button>
        </div>

        <AlertDialog 
            open={confirmDialog.open} 
            onClose={closeConfirmDialog}
            onConfirm={() => toggleProductStatus(confirmDialog.productId)}  // Corrected
            title="Confirm Status Change"
            description={`Are you sure you want to ${confirmDialog.currentStatus ? 'disable' : 'enable'} "${confirmDialog.productName}"?`}
            confirmText={confirmDialog.currentStatus ? 'Disable' : 'Enable'}
            confirmClass={confirmDialog.currentStatus ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        />


        </div>
    );
    };

    export default ProductList;