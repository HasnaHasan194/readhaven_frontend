
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { generateAndSendOTP } from '@/api/User/authApi';
import { validateUser } from "@/Validators/userSignupValidation";
import { Eye, EyeOff, Gift } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "@/Pages/User/Auth/AuthLayout";
import GoogleAuthButton from "@/components/UserComponent/Login/GoogleAuthButton";
export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referredBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Extract referral code from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('ref');
    if(referralCode){
      setFormData((prevData) => ({
        ...prevData,
        referredBy: referralCode,
      }));
    }
  }, [location.search]);

  const inputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    const { error } = validateUser(formData);

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });

      setErrors(validationErrors);
      return;
    }
        
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      const response = await generateAndSendOTP(formData);

      if (response && response.message === "OTP send successfully") {
        toast.success(response.message);
        navigate("/otp", { state: { email: formData.email, formData } });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setServerError(error.message);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-center">Signup</CardTitle>
        </CardHeader>
        
        {/* Referral Card - Only displayed when there's a referral code */}
        {formData.referredBy && (
          <div className="mx-4 mb-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                  <Gift className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">You've been referred!</h3>
                  <p className="text-xs text-blue-600">Signing up with referral code: <span className="font-semibold">{formData.referredBy}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {serverError && (
          <p className="text-red-500 text-sm text-center font-serif mt-1 px-4">{serverError}</p>
        )}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-sm mr-1">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={inputChange}
                  className="h-8 mt-1 bg-white border-gray-300 text-black"
                />
                {errors.firstName && (
                  <p className="text-red-500 font-serif text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={inputChange}
                  className="h-8 mt-1 bg-white border-gray-300 text-black"
                />
                {errors.lastName && (
                  <p className="text-red-500 font-serif text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={inputChange}
                autoComplete="username"
                className="h-8 mt-1 bg-white border-gray-300 text-black"
              />
              {errors.email && (
                <p className="text-red-500 font-serif text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={inputChange}
                className="h-8 mt-1 bg-white border-gray-300 text-black"
              />
              {errors.phone && (
                <p className="text-red-500 font-serif text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={inputChange}
                autoComplete="new-password"
                className="h-8 mt-1 bg-white border-gray-300 text-black pr-10" 
              />
              <button
                type="button"
                className="absolute right-3 top-10 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-950" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>

              {errors.password && (
                <p className="text-red-500 font-serif text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                value={formData.confirmPassword}
                onChange={inputChange}
                autoComplete="new-password"
                className="h-8 mt-1 bg-white border-gray-300 text-black pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-10 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 font-serif text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-6 flex flex-col items-center gap-6">
            <GoogleAuthButton />
          </div>
          
          <p className="mt-3 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 cursor-pointer">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}