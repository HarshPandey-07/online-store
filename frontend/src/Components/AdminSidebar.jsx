import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'
import { LuPanelLeftClose, LuLogOut, LuLayoutDashboard, LuPackagePlus, LuBookA, LuBox } from 'react-icons/lu'

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

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
		<div onClick={() => { setIsSidebarOpen(false) }} className={`fixed top-0 left-0 z-10 h-full w-64 px-6 py-5 text-center border-r border-slate-700 flex flex-col justify-between bg-[#16171d] text-white
			${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
			transition-transform duration-300 ease-in-out
		`}>
			<div className='flex flex-col text-lg'>
				<div className={"flex text-2xl cursor-default"}><LuPanelLeftClose className='cursor-pointer hover:text-sky-400' /><p className='ml-12'>Store</p></div>
				<div className='h-0 w-full border-t border-slate-700 my-1'></div>
				<div className='flex flex-col gap-2 mt-2'>
					<NavLink to={"/admin/dashboard"} className={({ isActive }) => `flex gap-4 p-2 transition-all hover:bg-sky-400 hover:text-black active:bg-sky-600 ${isActive ? "text-sky-700" : ""}`}><LuLayoutDashboard className='mt-1'/>Dashboard</NavLink>
					<NavLink to={"/admin/add-product"} className={({ isActive }) => `flex gap-4 p-2 transition-all hover:bg-sky-400 hover:text-black active:bg-sky-600 ${isActive ? "text-sky-700" : ""}`}><LuPackagePlus className='mt-1'/>Add product</NavLink>
					<NavLink to={"/admin/orders"} className={({ isActive }) => `flex gap-4 p-2 transition-all hover:bg-sky-400 hover:text-black active:bg-sky-600 ${isActive ? "text-sky-700" : ""}`}><LuBookA className='mt-1'/>Orders</NavLink>
					<NavLink to={"/admin/products"} className={({ isActive }) => `flex gap-4 p-2 transition-all hover:bg-sky-400 hover:text-black active:bg-sky-600 ${isActive ? "text-sky-700" : ""}`}><LuBox className='mt-1'/>Products</NavLink>
				</div>
			</div>
			<div className='flex flex-col gap-2 text-lg'>
				<div className='h-0 w-full border-t border-slate-700 my-1'></div>
				<button onClick={handleLogout} className={"flex justify-center gap-2 transition-all cursor-pointer hover:bg-rose-400 hover:text-black active:bg-rose-600"}><LuLogOut className='mt-1'/>Logout</button>
			</div>
		</div>
	)
}

export default AdminSidebar