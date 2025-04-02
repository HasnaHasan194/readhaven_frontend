import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Book,
  Home,
  ShoppingBag,
  User,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/api/User/authApi";
import { toast } from "react-toastify";
import { UserLogout } from "@/Redux/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartQuery } from "@/hooks/react-query/useCartCount";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading } = useCartQuery();

  //handle logout
  const handleLogout = async () => {
    try {
      const response = await logout();
      dispatch(UserLogout());
      toast.success(response.message);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "failed to logout");
    }
  };

  //handle cart navigation
  const handleCartNavigation = async () => {
    if (user) navigate("/cart");
    else {
      toast.error("You are not logged in ! Login to continue");
      navigate("/login");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-black relative z-10">
      {/* Logo and Website Name */}
      <div className="flex items-center space-x-2">
        <Book className="w-6 h-6 text-white" />
        <h1 className="text-xl font-bold text-white">ReadHaven</h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className="text-white flex items-center hover:text-gray-300 transition-colors"
        >
          <Home className="w-5 h-5 mr-1" /> Home
        </Link>
        <Link
          to="/shop-all"
          className="text-white flex items-center hover:text-gray-300 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mr-1" /> Shop
        </Link>
      </nav>

      {/* User Actions - Profile, Cart, Wishlist */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Wishlist Icon */}
        <Link
          to="/wishlist"
          className="relative text-white hover:text-gray-300 transition-colors"
        >
          <Heart className="w-5 h-5" />
        </Link>

        {/* Cart Icon */}
        <button
          className="relative inline-flex items-center justify-center p-2 text-white rounded-lg hover:bg-blue-400 transition-colors"
          onClick={handleCartNavigation}
        >
          <ShoppingCart className="w-5 h-5" />
          {!isLoading && data && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {data.count}
            </span>
          )}
        </button>

        {/* Profile Icon */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-gray-900 text-white border-gray-700"
            >
              <DropdownMenuItem asChild className="hover:bg-gray-800">
                <Link to="/account" className="cursor-pointer w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-gray-800"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="text-white bg-black border-white hover:text-black"
          >
            Login
          </Button>
        )}
      </div>

      {/* Mobile View Icons */}
      <div className="flex md:hidden items-center space-x-3">
        {/* Mobile Cart Icon */}
        <Link to="/cart" className="relative text-white">
          <ShoppingCart className="w-5 h-5" />
        </Link>

        {/* Mobile Wishlist Icon */}
        <Link to="/wishlist" className="relative text-white">
          <Heart className="w-5 h-5" />
        </Link>

        {/* Profile Button for Mobile */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white p-1">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-gray-900 text-white border-gray-700"
            >
              <DropdownMenuItem asChild className="hover:bg-gray-800">
                <Link to="/account" className="cursor-pointer w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-gray-800"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="text-white p-1"
          >
            <User className="h-5 w-5" />
          </Button>
        )}

        {/* Mobile Menu Button */}
        <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 shadow-lg p-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-white flex items-center hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-5 h-5 mr-2" /> Home
            </Link>
            <Link
              to="/shop-all"
              className="text-white flex items-center hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Shop
            </Link>
            <Link
              to="/wishlist"
              className="text-white flex items-center hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              <Heart className="w-5 h-5 mr-2" /> Wishlist
            </Link>
            <Link
              to="/cart"
              className="text-white flex items-center hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Cart
            </Link>
            {!isLoggedIn && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="text-white border-white hover:bg-gray-800 w-full justify-start"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
