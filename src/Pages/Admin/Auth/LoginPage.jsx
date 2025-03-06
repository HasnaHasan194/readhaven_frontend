
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/api/Admin/authApi";
import { useDispatch } from "react-redux";
import { AdminLogin } from "@/Redux/adminSlice";

import React, { useState } from "react";

import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
 
  const [serverError,setServerError] = useState("");
  const inputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await loginAdmin(formData);
      toast.success(response.message);
      dispatch(AdminLogin({ name: response.adminName }));
      
    } catch (error) {
      setServerError(error?.message);
      toast.error(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            LOGIN
          </CardTitle>
          {serverError && (
                <p className="text-red-500 text-sm mt-1">{serverError}</p>
              )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full"
                value={formData.email}
                onChange={inputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pr-10"
                  value={formData.password}
                  onChange={inputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-black dark:bg-white dark:text-black hover:opacity-90"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

  
