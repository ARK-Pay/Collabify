import React, { useState } from "react";

// DropdownButton Component
// Renders individual dropdown menu items with a label and URL
// Props:
// - label: text to display for the menu item
// - url: link destination for the menu item
const DropdownButton = ({ label, url }) => {
  return (
    <li>
      <a
        href={url}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {label}
      </a>
    </li>
  );
};

// DropdownMenu Component
// Renders the complete dropdown menu including user info and navigation items
const DropdownMenu = () => {
  // Array of menu items with their labels and URLs
  const menuItems = [
    { label: "Dashboard", url: "#" },
    { label: "Settings", url: "#" },
    { label: "Earnings", url: "#" },
    { label: "Sign out", url: "#" },
  ];

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden"
      style={{ top: "100%", zIndex: 50 }}
    >
      {/* User Information Section */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-900">Neil Sims</p>
        <p className="text-sm font-medium text-gray-900 truncate">
          neil.sims@flowbite.com
        </p>
      </div>
      {/* Navigation Menu Items */}
      <ul className="py-1">
        {menuItems.map((item, index) => (
          <DropdownButton key={index} label={item.label} url={item.url} />
        ))}
      </ul>
    </div>
  );
};

// Main Navbar Component
const Navbar = () => {
  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle function for dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Sidebar Toggle */}
          <div className="flex items-center justify-start rtl:justify-end">
            {/* Hamburger menu button for mobile sidebar */}
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              {/* Hamburger menu icon */}
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            {/* Logo and Brand Name */}
            <a href="https://flowbite.com" className="flex ms-2 md:me-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 me-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                Flowbite
              </span>
            </a>
          </div>

          {/* Right side - User Profile Section */}
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              {/* User Profile Button */}
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                  aria-expanded={dropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="User profile"
                  />
                </button>
              </div>

              {/* Conditional rendering of dropdown menu */}
              {dropdownOpen && <DropdownMenu />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
