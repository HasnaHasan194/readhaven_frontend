
import { Link, useNavigate } from "react-router-dom";
import { Menu, Book, Home, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/api/User/authApi";
import { toast } from "react-toastify";
import { UserLogout } from "@/Redux/userSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handle logout
  const handleLogout = async () => {
   
    try {
      const response = await logout();
      dispatch(UserLogout())
      toast.success(response.message)
      setMenuOpen(false);
      navigate("/");
    }
    catch (error) {
      toast.error(error?.message || "failed to logout");
    }
  }

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-black relative z-10">
      {/* Logo and Website Name */}
      <div className="flex items-center space-x-2">
        <Book className="w-6 h-6 text-white" />
        <h1 className="text-xl font-bold text-white">ReadHaven</h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-white flex items-center hover:text-gray-300">
          <Home className="w-5 h-5 mr-1" /> Home
        </Link>
        <Link to="/shop-all" className="text-white flex items-center hover:text-gray-300">
          <ShoppingBag className="w-5 h-5 mr-1" /> Shop
        </Link>
      </nav>

      {/* Profile Icon */}
      <div className="relative">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <User className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
        
      </div>

      {/* Mobile Menu Icon */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="w-6 h-6 text-white" />
      </button>
    </header>
  );
}