import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Edit2,
  Upload,
  X,
  Gift,
  Copy,
  Share2,
  CheckCircle,
} from "lucide-react";
import { editProfile, getUserProfile } from "@/api/User/profileApi";
import PasswordChangeModal from "./PasswordChangeModal";
import { toast } from "react-toastify";
import OTPVerificationModal from "../modal/OTPVerificationModal";
import { ForgotPasswordModal } from "../modal/ForgotPasswordModal";
import { VerifyNewEmail, verifyTheNewOtp } from "@/api/User/authApi";
import { userDetailsSchema } from "@/Validators/userValidation.js";
import CloudinaryImage from "../cloudinary/CloudinaryImage";
import axiosInstance from "@/api/User/axios";

const PersonalInformation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOTPVerifyModalOpen, setIsOTPVerifyModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [emailBefore, setEmailBefore] = useState("");
  const [emailAfter, setEmailAfter] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);

  const handleUploadSuccess = (data) => {
    setUploadedImage(data);
    setFormData({
      ...formData,
      profileImage: data.publicId,
    });
  };

  useEffect(() => {
    console.log("email after  ===>", emailAfter);
    console.log("email before  ===>", emailBefore);
  }, [emailAfter]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        console.log(response);
        setUserDetails(response.userDetails);
        setEmailBefore(response.userDetails.email);
        setEmailAfter(response.userDetails.email);
        setFormData(response.userDetails);
        if (response.userDetails.profileImage) {
          setPreviewImage(response.userDetails.profileImage);
        }
      } catch (error) {
        console.log(error?.message);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e) => {
    let file = null;
    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    setImageLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const response = await axiosInstance.post("/users/upload", {
            fileData: reader.result,
          });

          setImageLoading(false);
          handleUploadSuccess(response.data);
        } catch (err) {
          console.error("Upload failed:", err);
          setImageLoading(false);
        }
      };

      reader.onerror = () => {
        setImageLoading(false);
      };

      // // Upload image to Cloudinary and get the secure URL
      // const imageUrl = await uploadToCloudinary(file);

      // // Update the user details with the new image URL
      // setUserDetails((prev) => ({
      //   ...prev,
      //   profileImage: imageUrl,
      // }));

      // setFormData((prev) => ({
      //   ...prev,
      //   profileImage: imageUrl,
      // }));

      // toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerError("");

    setLoading(true);

    console.log("here is the fordat==>", formData);
    // delete formData.usedCoupons;
    // delete formData.walletBalance;

    const { error } = userDetailsSchema.validate(formData, {
      abortEarly: false,
    });

    console.log(error);

    if (error) {
      // Collect validation errors
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });

      console.log("here i sthe validatiion  error++>", validationErrors);
      setErrors(validationErrors); // Set validation errors
      toast.error("Please fix validation errors.");
      setLoading(false);
      return;
    }

    console.log(
      "----------",
      emailBefore,
      emailAfter,
      emailBefore.trim() !== emailAfter.trim()
    );

    if (emailBefore.trim() !== emailAfter.trim()) {
      sendOTP();
      return;
    }

    try {
      console.log("profile image, ", formData);

      // Send the updated profile data
      const response = await editProfile(formData);
      console.log(response);
      toast.success(response.message);
      setUserDetails(formData); // Update user details with new form data
      setIsEditing(false);
    } catch (error) {
      setServerError(error.message || "Failed to update profile.");
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!emailAfter.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAfter)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API call
      await VerifyNewEmail({ email: emailAfter });

      setEmailBefore(emailAfter);

      toast.success("Reset code sent successfully!");
      console.log(
        "---------------------------------------------------",
        formData
      );

      setIsOTPVerifyModalOpen(true);
    } catch (error) {
      console.error("Failed to send OTP Error:", error);
      toast.error(error?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpValue) => {
    try {
      const response1 = await verifyTheNewOtp({
        email: emailAfter,
        otp: otpValue,
      });
      toast.success("Verified success");
      const response2 = await editProfile(formData);
      console.log(response2);
      toast.success(response2.message);
      setUserDetails(formData); // Update user details with new form data
      setIsEditing(false);
      setIsOTPVerifyModalOpen(false);
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset the profile image preview if it was changed
    if (userDetails.profileImageUrl) {
      setPreviewImage(userDetails.profileImageUrl);
    } else {
      setPreviewImage(null);
    }
    setProfileImage(null);
    // Reset form data to original user details
    setFormData(userDetails);
  };

  const copyReferralLink = () => {
    const referralCode = userDetails.referralCode;
    const referralLink = `http://localhost:5173/signup?ref=${referralCode}`;
    console.log("sjdhfiu",referralLink)

    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy referral link");
      });
  };

  const shareReferralLink = () => {
    const referralCode = userDetails.referralCode;
    const referralLink = `http://localhost:5173/signup?ref=${referralCode}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Join using my referral link",
          text: "Sign up using my referral link and we both get rewards!",
          url: referralLink,
        })
        .then(() => message.success("Thanks for sharing!"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar is assumed to be in a separate component */}
      <div className="flex-shrink-0 w-64">{/* Sidebar Component Here */}</div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User size={24} className="text-gray-700" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Personal Information
            </h1>
            {serverError && (
              <p className="text-red-500 text-sm mt-1">{serverError}</p>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                         hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              <Edit2 size={18} />
              Edit Information
            </button>
          )}
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
          {/* Profile Image Section */}
          <div className="mb-6 flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Profile Picture
            </label>
            <div className="relative">
              {formData.profileImage ? (
                <div className="relative">
                  {/* {
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  } */}
                  <CloudinaryImage
                    publicId={uploadedImage?.publicId || formData.profileImage}
                  />

                  {isEditing && (
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}

              {isEditing && (
                <div className="mt-4">
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
                  >
                    <Upload size={18} />
                    {previewImage ? "Change Image" : "Upload Image"}
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                First Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {formData.firstName || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {formData.lastName || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Email Address
                {isEditing && (
                  <span className="ml-2 text-xs text-gray-400">
                    (Cannot be changed)
                  </span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    setEmailAfter(e.target.value);
                  }}
                  className="w-full text-lg font-medium text-gray-500 p-3 bg-gray-100 rounded-lg border border-gray-200 "
                />
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {formData.email || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Mobile Number
              </label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {formData.phone || "N/A"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex justify-between">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg 
                                hover:bg-gray-800 transition-colors duration-300 font-medium"
            >
              <Lock size={18} />
              Change Password
            </button>

            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg 
                               hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || imageLoading}
                  className={`px-6 py-3 rounded-lg transition-colors duration-300 font-medium ${
                    loading || imageLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading || imageLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Refer to Earn Card */}
        <div className="bg-gradient-to-tr from-purple-900 via-indigo-800 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          {/* Abstract decorative elements */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white opacity-5 rounded-full"></div>
          <div className="absolute right-20 bottom-16 w-24 h-24 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-white opacity-5 rounded-full"></div>

          {/* Header with icon */}
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-white/20 p-2 rounded-lg">
              <Gift size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Refer & Earn</h2>
          </div>

          {/* Description text */}
          <p className="mb-6 text-white/90 text-sm leading-relaxed">
            Invite your friends and family to join us. Both of you will receive
            rewards when they sign up using your referral link.
          </p>

          {/* Referral Link Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Your Referral Link
            </label>
            <div className="flex items-center bg-black/20 rounded-lg p-3 break-all">
              <span className="text-sm truncate flex-1 font-mono">
                http://localhost:5173/signup?ref=
                {userDetails.referralCode || userDetails._id || "USER123"}
              </span>
              <button
                onClick={copyReferralLink}
                className="ml-2 p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={shareReferralLink}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl 
              hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg"
          >
            <Share2 size={18} />
            Share Your Link
          </button>
        </div>

        <ForgotPasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setVerifyTrue={() => {
            setIsOTPVerifyModalOpen(true);
          }}
        />

        <OTPVerificationModal
          email={emailAfter}
          isOpen={isOTPVerifyModalOpen}
          onClose={() => setIsOTPVerifyModalOpen(false)}
          onResendOTP={() => sendOTP()}
          onVerify={handleOTPVerify}
        />

        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          email={userDetails.email}
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
