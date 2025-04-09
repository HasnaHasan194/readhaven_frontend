import {getCoupons,addCoupon} from '@/api/Admin/couponApi.js'
import { validateCoupon } from "@/Validators/couponValidation";
import React ,{useState} from 'react';
import { toast } from 'react-toastify';

const AddCoupon = () => {
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumPurchase: '',
    expiryDate: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [couponError , setCouponError] = useState("")

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = "";
    for (let i = 0; i < 8; i++){
        randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setCouponData((prevState) => ({
        ...prevState,
        code: randomCode,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value
    });

        // Clear error for the field being edited
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
  };

  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage('');
      setNotificationType('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate coupon data
    const { error } = validateCoupon(couponData);
    if (error) {
      const validationErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
    
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      if(couponData.discountType === "percentage" && couponData.discountValue >85){
         const discountError = "Discount value must be less than 85%"
         toast.error(discountError)
         setCouponError(discountError)
         return
      }

      if(couponData.discountType==="amount" && couponData.discountValue>=couponData.minimumPurchase){
        const discountError = "Discount value must be less than minimum purchase"
        toast.error(discountError)
        setCouponError(discountError)
        return
      }

      const response = await addCoupon(couponData);
      showNotification('success', response.message);
  
      // Reset form after successful submission
      setCouponData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minimumPurchase: '',
        expiryDate: '',
        description: ''
      });
  
    } catch (error) {
      showNotification('error', error?.message || "Failed to add coupon");
      console.error("Error in adding coupon", error);
    }
    finally{
      setLoading(false);
    }
  
   
  };
  
  return (
    <div className="min-h-screen ml-48 bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-3xl p-8">
        {notificationMessage && (
          <div className={`mb-4 p-4 rounded-lg ${notificationType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notificationMessage}
          </div>
        )}
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold text-black">Create New Coupon</h2>
            <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
              NEW
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Code */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-lg font-medium text-black">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-500"
                    placeholder="e.g. SUMMER25"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 px-3 py-2 rounded-lg text-white font-bold"
                    onClick={generateCouponCode}
                  >
                    Generate
                  </button>
                  {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <label htmlFor="discountType" className="block text-lg font-medium text-black">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  value={couponData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Fixed Amount</option>
                </select>
                {errors.discountType && <p className="text-red-500 text-sm">{errors.discountType}</p>}
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <label htmlFor="discountValue" className="block text-lg font-medium text-black">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={couponData.discountValue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-500"
                    placeholder={couponData.discountType === 'percentage' ? 'e.g. 25' : 'e.g. 10.00'}
                    min="0"
                    step={couponData.discountType === 'percentage' ? '1' : '0.01'}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">
                    {couponData.discountType === 'percentage' ? '%' : '$'}
                  </span>
                  {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue}</p>}
                  {couponError && <p className='text-red-500 text-sm'>{couponError}</p>}
                </div>
              </div>

              {/* Minimum Purchase */}
              <div className="space-y-2">
                <label htmlFor="minimumPurchase" className="block text-lg font-medium text-black">
                  Minimum Purchase
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">₹</span>
                  <input
                    type="number"
                    id="minimumPurchase"
                    name="minimumPurchase"
                    value={couponData.minimumPurchase}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-500"
                    placeholder="e.g. 50.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.minimumPurchase && <p className="text-red-500 text-sm">{errors.minimumPurchase}</p>}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="block text-lg font-medium text-black">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={couponData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-lg font-medium text-black">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={couponData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-500"
                placeholder="Add details about this coupon"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Preview Card */}
            <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-md">
              <div className="relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gray-100 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-gray-200 rounded-full opacity-50 blur-xl"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="font-extrabold text-2xl text-black">
                      {couponData.code || 'YOUR COUPON'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {couponData.description || 'Your exclusive discount'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-black">
                      {couponData.discountValue ? 
                        (couponData.discountType === 'percentage' ? `${couponData.discountValue}%` : `₹${couponData.discountValue}`)
                        : '---'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {couponData.expiryDate ? `Valid until: ${new Date(couponData.expiryDate).toLocaleDateString()}` : 'No expiration'}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 border-dashed flex justify-between">
                  <div className="text-xs text-gray-600">
                    {couponData.minimumPurchase ? `Min. purchase: ₹${couponData.minimumPurchase}` : 'No minimum purchase'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {couponData.usageLimit ? `Limited to ${couponData.usageLimit} uses` : 'Unlimited usage'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-6 mt-8">
              <button
                type="button"
                className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-black font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold shadow-md transition-all flex items-center justify-center ${loading ? 'opacity-75' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Coupon'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;