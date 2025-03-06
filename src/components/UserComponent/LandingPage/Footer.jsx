import React from 'react';
import { Facebook, Instagram, Linkedin, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="black font-semibold mb-2">Contact</h4>
            <div className="space-y-1">
              <p>Home</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Customer Services</h4>
            <div className="space-y-1">
              <p>FAQ</p>
              <p>Shipping and Returns</p>
              <p>Order Tracking</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">About Us</h4>
            <div className="space-y-1">
              <p>Our Story</p>
              <p>Careers</p>
              <p>Privacy Policy</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6" />
              <Instagram className="w-6 h-6" />
              <Linkedin className="w-6 h-6" />
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;