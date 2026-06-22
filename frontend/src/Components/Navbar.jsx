import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'

const Navbar = ({ setIsSidebarOpen }) => {

  const { user } = useAuth();

  return (
    <div className='h-14 w-full z-10 flex bg-[#16171d] border-b border-b-gray-700 p-3 text-lg sticky top-0'>
      <div className='flex md:gap-4 gap-2'>
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
      <div className='flex md:gap-4 gap-1 ml-auto'>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${isActive ? "text-sky-400" : ""}`
          }
        >
          Home🏡
        </NavLink>
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
        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${user === null ? "hidden" : ""} ${isActive ? "text-sky-400" : ""}`
          }
        >
          {user?.username}⚙️
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `transition-all duration-200 hover:text-slate-400 cursor-pointer ${user === null ? "hidden" : ""} ${isActive ? "text-sky-400" : ""}`
          }
        >
          Orders📦
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar