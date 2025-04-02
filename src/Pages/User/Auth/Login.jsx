// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { UserLogin } from "@/Redux/userSlice";
// import { Eye, EyeOff } from "lucide-react";
// import { message } from "antd";
// import "antd/dist/reset.css";
// import { loginUser } from "@/api/User/authApi";
// import GoogleAuthButton from "@/components/UserComponent/Login/GoogleAuthButton.jsx";
// import { validateLogin } from "@/Validators/userSignupValidation.js";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("")

//   const inputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [e.target.name]: "",
//     }));

//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setServerError("");

//     // Validate input with Joi
//     const { error } = validateLogin(formData);
//     if (error) {
//       const validationErrors = {};
//       error.details.forEach((err) => {
//         validationErrors[err.path[0]] = err.message;
//       });

//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await loginUser(formData);
//       message.success(response.message);

//       dispatch(UserLogin({ name: response?.userName }));

//       navigate("/");
//     } catch (error) {
//       setServerError(error?.message || "Invalid credentials");
//       message.error(error?.message || "Login failed! Please try again");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* Header */}
//       <header className="py-6 px-4 border-b border-gray-200">
//         <h1 className="text-2xl font-bold text-center text-black">READ HAVEN</h1>
//       </header>

//       {/* Main content */}
//       <main className="flex-grow flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-md">
//           <div className="border border-black rounded-lg p-8 shadow-sm">
//             <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
//               Log in to your account
//             </h2>
//             {serverError && (
//               <p className="text-red-500 text-md text-center font-serif mt-1">{serverError}</p>
//             )}

//             <form className="space-y-6" onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="email-address">Email address</Label>
//                   <Input
//                     id="email-address"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     value={formData.email}
//                     onChange={inputChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
//                     placeholder="Email address"
//                   />

//                   {errors.email && (
//                     <p className="text-red-500 font-serif text-md mt-1">{errors.email}</p>
//                   )}

//                 </div>
//                 <div className="relative">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     value={formData.password}
//                     onChange={inputChange}
//                     className="mt-1 block w-full pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
//                     placeholder="Password"
//                   />
//                    <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="absolute right-3 top-10 transform -translate-y-1/2"
//                   >
//                     {showPassword ? (
//                       <EyeOff size={20} className="text-gray-500" />
//                     ) : (
//                       <Eye size={20} className="text-gray-500" />
//                     )}
//                   </button>

//                   {errors.password && (
//                     <p className="text-red-500 font-serif text-md mt-1">{errors.password}</p>
//                   )}

//                 </div>
//               </div>

//               <div>
//                 <Button
//                   type="submit"
//                   className="w-full  "
//                 >
//                   Log in
//                 </Button>
//                 <p onClick={()=>navigate("/forgot/verifyEmail")} className="font-medium text-black hover:text-gray-800 cursor-pointer"> Forgot Password </p>
//               </div>
//             </form>

//             <div className="mt-6 flex flex-col items-center gap-4">

//               <p>OR</p>

//             <GoogleAuthButton />

//               <p
//                 onClick={() => navigate("/signup")}
//                 className="font-medium text-black hover:text-gray-800 cursor-pointer"
//               >
//                 Don't have an account ? Sign up
//               </p>

//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
      // <footer className="py-4 px-4 border-t border-gray-200">
      //   <p className="text-center text-sm text-gray-500">
      //     © 2023 READHAVEN. All rights reserved.
      //   </p>
      // </footer>
//     </div>
//   );
// }

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Eye, EyeOff } from "lucide-react"
// Remove antd imports
// import { message } from "antd"
// import "antd/dist/reset.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GoogleAuthButton from "@/components/UserComponent/Login/GoogleAuthButton.jsx"
import { validateLogin } from "@/Validators/userSignupValidation.js"
import { UserLogin } from "@/Redux/userSlice"
import { loginUser } from "@/api/User/authApi"
import AuthLayout from "@/Pages/User/Auth/AuthLayout"

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  // Add a state for success message
  const [successMessage, setSuccessMessage] = useState("")

  const inputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setServerError("")
    setSuccessMessage("")

    // Validate input with Joi
    const { error } = validateLogin(formData)
    if (error) {
      const validationErrors = {}
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message
      })

      setErrors(validationErrors)
      return
    }

    try {
      const response = await loginUser(formData)
      // Replace antd message with state
      setSuccessMessage(response.message)

      dispatch(UserLogin({ name: response?.userName }))

      navigate("/")
    } catch (error) {
      setServerError(error?.message || "Invalid credentials")
      // Replace antd message with console or alert
      console.error(error?.message || "Login failed! Please try again")
    }
  }

  return (
    <AuthLayout>
      <div className="border border-black rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Log in to your account</h2>

        {serverError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-500 text-sm text-center">{successMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-address" className="block mb-1.5">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={inputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="block mb-1.5">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={inputChange}
                  className="block w-full pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Log in
            </Button>

            <div className="mt-3 text-center">
              <p
                onClick={() => navigate("/forgot/verifyEmail")}
                className="text-sm font-medium text-black hover:text-gray-800 cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6">
            <GoogleAuthButton />

            <p
              onClick={() => navigate("/signup")}
              className="text-sm font-medium text-black hover:text-gray-800 cursor-pointer"
            >
              Don't have an account? Sign up
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}