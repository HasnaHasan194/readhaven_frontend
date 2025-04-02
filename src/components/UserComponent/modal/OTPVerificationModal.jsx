import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const OTPVerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  onResendOTP
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = Array(6).fill(0).map(() => useRef(null));

  useEffect(() => {
    if (isOpen) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let timerInterval;

    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      await onVerify(otpValue);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await onResendOTP();
    setTimer(60);
    setCanResend(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-semibold text-center mb-2">
                  Verification Code
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  Enter the code sent to {email}
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={cn(
                          "w-12 h-12 text-center text-2xl font-semibold rounded-lg",
                          "border-2 border-gray-200 focus:border-black focus:outline-none",
                          "transition-all duration-200",
                          "bg-white"
                        )}
                      />
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend code in <span className="font-medium">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className={cn(
                      "w-full bg-black text-white hover:bg-gray-800",
                      "transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OTPVerificationModal;