import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* App Title */}
        <Link to="/" className="text-xl font-bold hover:text-gray-200">
          🎫 TicketManager
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/create-ticket" className="hover:text-gray-300">New Ticket</Link>
              <span className="text-sm text-white/80 hidden sm:inline">
                👤 {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
