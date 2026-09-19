import React, { useState } from 'react';
import { ChevronRight, User, MapPin, ShoppingBag, Wallet, Heart, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/User/authApi.js';
import { message } from 'antd';

const UserSideBar = () => {
  const [activeRoute, setActiveRoute] = useState('account');
  const userName = useSelector((state) => state?.user?.user|| "Guest");
  const name = userName.name
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const menuItems = [
    { icon: <User size={20} />, label: 'Profile', path: '/account' },
    { icon: <MapPin size={20} />, label: 'Address', path: '/address' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/orders' },
    { icon: <Wallet size={20} />, label: 'Wallet', path: '/wallet' },
    { icon: <Heart size={20} />, label: 'Wishlist', path: '/wishlist' },
    { icon: <LogOut size={20} />, label: 'Logout', path: '/login', isLogout: true },
  ];

  const handleNavigation = (label,path) => {
    setActiveRoute(label);
    navigate(path)
  };

  //handle logout
    const handleLogout = async () => {
      try {
        const response = await logout();
        message.success(response.message);
        dispatch(UserLogout());
      } catch (error) {
        message.error("Failed to logout");
      }
    };
  

  return (
    <div className="w-full md:w-64 h-auto md:h-screen bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-lg p-2 md:p-6 overflow-x-auto md:overflow-y-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-gray-400 md:scrollbar-track-gray-200">
      {/* User Profile Header */}
      <div className="hidden md:flex items-center gap-4 p-4 mb-8 border-b hover:bg-gray-50 rounded-md transition-all duration-300 cursor-pointer">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold 
                    transform transition-transform duration-300 hover:scale-110">
          {name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="font-semibold text-lg">{name}</span>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-8">
          {menuItems.map((item, index) => (
            <li key={index} className="flex-shrink-0">
     <button 
        onClick={() => {
          if (item.isLogout) {
            handleLogout();
          } else {
            handleNavigation(item.label, item.path);
          }
        }}
        className={`w-full flex items-center justify-center md:justify-between p-3 md:p-4 rounded-md transition-all duration-300
          ${activeRoute === item.label 
            ? 'bg-black text-white shadow-md transform scale-105' 
            : item.isLogout
              ? 'text-gray-700 hover:bg-red-100 hover:text-red-600 hover:shadow-md hover:scale-102'
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-102'}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
          <div className={`transform transition-transform duration-300 
                  ${activeRoute === item.label ? 'scale-110' : 'group-hover:scale-110'}`}>
            {item.icon}
          </div>
          <span className="font-medium text-[10px] md:text-base">{item.label}</span>
        </div>
        <ChevronRight 
          size={18} 
          className={`hidden md:block transition-transform duration-300
                  ${activeRoute === item.label ? 'rotate-90' : ''}`}
        />
      </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserSideBar;
