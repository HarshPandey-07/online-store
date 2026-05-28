import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'

const Navbar = ({ setIsSidebarOpen }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.ok) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <div className='h-14 w-full z-10 flex bg-[#16171d] border-b border-b-gray-700 p-3 text-lg sticky top-0'>
      <div className='flex gap-4'>
        <div
          onClick={() => { setIsSidebarOpen(prev => !prev) }}
          className={
            `transition-all duration-200 hover:text-slate-400 cursor-e-resize ${user === null || user?.role !== 'admin' ? "hidden" : ""}`
          }
        >
          <span className='tracking-widest text-2xl'>☰</span>
        </div>
        <NavLink to={"/"} className="transition-all text-xl duration-200 hover:text-slate-400 cursor-pointer">Store</NavLink>
      </div>
      <div className='flex gap-8 ml-auto'>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${user !== null ? "hidden" : ""} ${isActive ? "text-sky-400" : ""}`
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/sign-up"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${user !== null ? "hidden" : ""} ${isActive ? "text-sky-400" : ""}`
          }
        >
          Sign-up
        </NavLink>
        <div
          className={
            `transition-all duration-200 hover:text-sky-400 cursor-default ${user === null ? "hidden" : ""}`
          }
        >
          {user?.username}
        </div>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${user === null ? "hidden" : ""} ${isActive ? "text-sky-400" : ""}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/user"
          onClick={handleLogout}
          className={`transition-all duration-200 hover:text-red-400 cursor-pointer ${user === null ? "hidden" : ""}`}
        >
          Logout
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar