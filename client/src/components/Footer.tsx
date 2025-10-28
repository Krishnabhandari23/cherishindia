import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 text-white mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h3 className="text-2xl font-bold">Cherish India</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium e-commerce platform offering authentic Indian products with a touch of tradition and modernity. 
              Discover quality items that celebrate India's rich heritage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <nav className="space-y-2">
              <button 
                onClick={() => onNavigate('home')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('products')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                All Products
              </button>
              <button 
                onClick={() => onNavigate('cart')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Shopping Cart
              </button>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact
              </a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <nav className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Electronics
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Clothing
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home & Garden
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Sports
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Books
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">support@cherishindia.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Cherish India. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Return Policy</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}