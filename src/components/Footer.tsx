import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                PawCare
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting hearts for animal welfare. Building a compassionate community for pets and wildlife protection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Pet Adoption</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Find Veterinarians</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Lost & Found</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Pet Training</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Wildlife Sanctuaries</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Endangered Species</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Pet Surrender Care</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Health Records</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Emergency Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Community Groups</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Pet Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Report Abuse</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>info@pawcare.org</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(555) 123-PAWS</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>123 Animal Care Blvd<br />Compassion City, CC 12345</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Emergency Hotline</h4>
              <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-center">
                <Phone className="h-4 w-4 inline mr-2" />
                <span className="font-bold">(555) 911-PETS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} PawCare. All rights reserved. Made with ❤️ for animals.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;