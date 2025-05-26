import React, { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white">
      <header className="fixed inset-x-0 top-0 z-50 bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white">
        <nav aria-label="Global" className="flex items-center justify-between p-4 lg:p-6 lg:px-8">
          
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-black">InterNeoAI</h1>
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-6">
            <a href="/home" className="text-sm font-semibold leading-6 text-gray-900">Home</a>
            <a href="/home" className="text-sm font-semibold leading-6 text-gray-900">About Us</a>
            <a href="/home" className="text-sm font-semibold leading-6 text-gray-900">Teams</a>
          </div>
        </nav>

        {/* Mobile menu (dropdown) */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 space-y-2 p-4 bg-white shadow-md">
            <a href="/home" className="block text-sm font-semibold leading-6 text-gray-900">Home</a>
            <a href="/home" className="block text-sm font-semibold leading-6 text-gray-900">About Us</a>
            <a href="/home" className="block text-sm font-semibold leading-6 text-gray-900">Teams</a>
          </div>
        )}
      </header>
    </div>
  );
}

export default Navbar;
