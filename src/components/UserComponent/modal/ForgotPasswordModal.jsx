import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'

export function ForgotPasswordModal({ isOpen, onClose, setVerifyTrue }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = () => {
    setVerifyTrue(email)
  }

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Forgot Password</DialogTitle>
          <DialogDescription className="text-center">
            Enter your email address to receive a password reset code
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-address">Email address</Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Enter your email address"
            />
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// // Mock API function - replace with your actual implementation
// async function forgotVerifyEmail({ email }) {
//   // This is a placeholder for the actual API call
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email) {
//         resolve({ message: "Reset code sent successfully!" })
//       } else {
//         reject(new Error("Failed to send reset code"))
//       }
//     }, 1500)
//   })
// }