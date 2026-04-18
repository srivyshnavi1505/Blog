import React from "react";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <nav className="bg-teal-400 text-shadow-blue-950 p-6 flex justify-between items-center text-2xl">
      
      {/* Logo */}
      <div className="font-medium text-xl cursor-pointer">
        <NavLink to="/">Blog</NavLink>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-800 underline" : "hover:underline"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ?  "text-blue-800 underline" : "hover:underline"
            }
          >
            Register
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ?  "text-blue-800 underline" : "hover:underline"
            }
          >
            Login
          </NavLink>
        </li>

        
      </ul>

    </nav>
  );
}