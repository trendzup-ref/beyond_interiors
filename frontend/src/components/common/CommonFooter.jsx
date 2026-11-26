import React from "react";
import { Link } from "react-router";
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Globe,
  ArrowUpRight,
} from "lucide-react";

// Social Media Icons
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const CommonFooter = () => {
  return (
    <footer className="w-full bg-[#1C1211] text-stone-300 font-sans mt-auto border-t border-[#2D1E1C]">
      {/* Upper Main Section (5-Column Grid matching reference image) */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1 (Brand, Monogram & Description) - lg:col-span-4 */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/Beyond Interiors Luxury Logo.png"
                alt="Beyond Interiors"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>

            <p className="text-xs sm:text-[13px] text-stone-400 font-light leading-relaxed max-w-sm">
              We design and craft bespoke architectural furniture, designer lighting, imported wall finishes, and turnkey interior installations designed to elevate modern sanctuaries.
            </p>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A1D1B] hover:bg-[#A73D4D] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A1D1B] hover:bg-[#A73D4D] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A1D1B] hover:bg-[#A73D4D] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A1D1B] hover:bg-[#A73D4D] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A1D1B] hover:bg-[#A73D4D] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Pinterest"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>

          {/* Column 2 (Company) - lg:col-span-2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Career & Artisans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (Customer Services) - lg:col-span-2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-white transition-colors">
                  Return & Replacement
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 (Our Information) - lg:col-span-2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Our Information
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  User Terms & Condition
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 (Contact Info) - lg:col-span-2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Contact Info
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4C26B] shrink-0 mt-0.5" />
                <a href="tel:+919820012345" className="hover:text-white font-mono">
                  +91 98200 12345
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4C26B] shrink-0 mt-0.5" />
                <a
                  href="mailto:concierge@beyondinteriors.com"
                  className="hover:text-white truncate max-w-[180px]"
                >
                  concierge@beyondinteriors.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4C26B] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Horizon Design Park, Worli Sea Face, Mumbai 400018
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar (matching exact reference) */}
      <div className="border-t border-[#2A1D1B] bg-[#160E0D]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-400">
          <p className="text-[11px] sm:text-xs">
            Copyright &copy; {new Date().getFullYear()} Beyond Interiors Design. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;
