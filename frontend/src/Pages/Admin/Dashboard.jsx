import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';

const Dashboard = () => {

    const [order, setOrder] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [page, setPage] = useState(0);
    const [isCompleted, setIsCompleted] = useState({});

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchAdminOrder = async () => {
        try {
            const res = await fetch(`/api/admin/order?page=${page}&size=3`, {
                credentials: 'include'
            });
            if (!res.ok) {
                console.log("Something went wrong");
                return;
            }
            const data = await res.json();
            setOrder(data.content);
            const orderState = {};

            data.content.forEach(item => {
                orderState[item.id] = item.status === "DELIVERED" || item.status === "CANCELED";
            });

            setIsCompleted(orderState);
            setPageInfo({
                page: data.page,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            })
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };
    useEffect(() => {
        // if (user?.role === 'admin')
        fetchAdminOrder();
    }, [page]);

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

    const formatDate = (date) => {
        if (!date) return "N/A";
        const dateObj = new Date(date);

        if (isNaN(dateObj)) return "Invalid date";

        const displayDate = dateObj.toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return displayDate;
    };

    const handleDelivered = async (id) => {
        setIsCompleted(prev => ({
            ...prev,
            [id]: true
        }));
        try {
            const res = await fetch(`/api/admin/order/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                console.log("Something went wrong!");
                return;
            }
            setIsCompleted(prev => ({
                ...prev,
                [id]: true
            }));
            fetchAdminOrder();
        } catch (error) {
            console.log("Something went wrong: ", error);
            setIsCompleted(prev => ({
                ...prev,
                [id]: false
            }));
        }
    }

    const handleCancel = async (id) => {
        setIsCompleted(prev => ({
            ...prev,
            [id]: true
        }));
        try {
            const res = await fetch(`/api/admin/order/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) {
                console.log('Cannot cancel the order: ', res.json());
                return;
            }
            console.log(res.json());
            setIsCompleted(prev => ({
                ...prev,
                [id]: true
            }));
            fetchAdminOrder();
        } catch (error) {
            console.log("Something went wrong: ", error);
            setIsCompleted(prev => ({
                ...prev,
                [id]: false
            }));
        }
    }

    const pageForward = (e) => {
        e.preventDefault();
        if (pageInfo.totalPages > page)
            setPage(page + 1);
    };
    const pageBackward = (e) => {
        e.preventDefault();
        if (page !== 0)
            setPage(page - 1);
    };

    if (user === null) {
        return (
            <div className='flex flex-col m-20 text-center'>
                <div className='space-y-5'>
                    <p className='text-xl text-rose-500 tracking-wide'>User not logged in <span className='text-slate-400'>Please login first</span></p>
                    <button onClick={() => { navigate("/login") }} className='text-lg bg-emerald-600 p-2 rounded-xl w-fit'>Login</button>
                </div>
            </div>
        )
    }

    return (
        <div className='h-[calc(100dvh-86px)] md:mx-12 border-x border-x-slate-700 flex flex-col'>
            <div className='md:flex flex-2'>
                <div className='p-4 flex-1 bg-[#16171d]'>
                    <div className='felx justify-between align-middle'>
                        <p className='text-3xl'>{user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}</p>
                        <p className='text-sm text-slate-400'>{user?.role}</p>
                        <button onClick={handleLogout} className='bg-red-500 p-2 text-lg rounded-xl cursor-pointer transition hover:ring-2 active:ring-violet-500 active:bg-rose-800'>Logout</button>
                    </div>
                </div>
                {
                    user?.role === "admin" &&
                    <div className='p-4 flex-1 md:w-1/2 bg-[#16171d] md:border-l border-t md:border-t-0 border-slate-700'>
                        <p className='text-xl'>Admin panel</p>
                        <p className='text-slate-400 text-sm mb-2'>Controls</p>
                        <div className='h-0 w-full border-t border-slate-700 my-4'></div>
                        <div className='flex justify-evenly align-middle text-lg text-blue-500'>
                            <NavLink to={"/admin/add-product"} className='hover:underline transition'>Add product</NavLink>
                            <div className='h-7 w-0 border-r border-slate-700'></div>
                            <NavLink className="hover:underline transition">Refill stock</NavLink>
                        </div>
                        <div className='h-0 w-full border-t border-slate-700 my-4'></div>
                        <p className='text-lg text-slate-300'>View orders</p>
                        <div className='space-x-8'>
                            <button onClick={pageBackward} className={`h-fit w-fit tracking-wider text-blue-500 cursor-pointer hover:underline ${page === 0 ? "hidden" : ""}`}>Previous</button>
                            <button onClick={pageForward} className={`h-fit w-fit tracking-wider text-blue-500 cursor-pointer hover:underline ${pageInfo.totalPages === page + 1 ? "hidden" : ""}`}>Next</button>
                        </div>
                        <div className='h-0 w-full border-t border-slate-700 my-4'></div>
                        <div className='flex justify-evenly align-middle gap-4 relative overflow-x-auto pb-1'>
                            {
                                order.length === 0
                                    ? <i>No orders yet!</i>
                                    : order.map(item => (
                                        <div key={item.id} className='h-fit min-w-54 bg-slate-700 text-white rounded-xl shadow-lg p-2 space-y-2'>
                                            <div className='flex justify-between align-middle'>
                                                <p className='text-slate-400 text-xs tracking-tight'>ID:{item.id}</p>
                                                <button disabled={isCompleted[item.id]} onClick={() => { handleCancel(item.id) }} className={`p-0.5 px-2 bg-red-500 rounded-2xl hover:ring-2 active:ring-red-500 cursor-pointer transition ${isCompleted[item.id] && "hidden"}`}>Cancel</button>
                                            </div>
                                            <h3 className='text-center text-xl'>Products</h3>
                                            <div className='border bg-slate-600 min-h-18 flex flex-col justify-center align-middle gap-2'>
                                                {
                                                    item.orderItems.map(i => (
                                                        <div key={i.id} className='flex justify-center align-middle text-center gap-2'>
                                                            <p className='text-lg tracking-wider'>{i.product.name}</p>
                                                            <p className='text-slate-300 text-sm tracking-tighter'>{i.quantity}</p>
                                                            <p className='text-slate-300 text-sm tracking-tighter'>₹{i.priceAtPurchased}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className='text-right text-slate-300'>
                                                <p>Total price - ₹{item.totalPrice}</p>
                                                <p>Status - {item.status}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className='text-sm text-slate-300'>
                                                    <p>{formatDate(item.createdAt)}</p>
                                                    <p>{item.user.username}</p>
                                                </div>
                                                <div className='flex justify-evenly align-middle'>
                                                    <button disabled={isCompleted[item.id]} onClick={() => { handleDelivered(item.id) }} className={`p-0.5 px-2 bg-green-500 rounded-2xl hover:ring-2 active:ring-green-500 cursor-pointer transition ${isCompleted[item.id] && "hidden"}`}>Delivered</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Dashboard