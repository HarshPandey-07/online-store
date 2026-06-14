import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { formatINR, formatNumber } from '../../utils/formatters'

const Dashboard = () => {

    const [order, setOrder] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [page, setPage] = useState(0);
    const [isCompleted, setIsCompleted] = useState({});

    const [stats, setStats] = useState({
        orders: 0,
        ordersPending: 0,
        ordersDelivered: 0,
        ordersCanceled: 0
    })

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

    // Remove this and shift the function call to the last useEffect(); After the revamp of the orders section
    useEffect(() => {
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

    const loadStats = async () => {
        try {
            const res = await fetch("/api/admin/order/stats", {
                credentials: 'include'
            });

            if (!res.ok) {
                console.log("Something went wrong: ", res.statusText);
                return;
            }

            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    useEffect(() => {
        loadStats();
    }, [])


    if (user?.role !== 'admin') return;

    return (
        <div className='md:h-[calc(100dvh-86px)] md:mx-12 border-x border-x-slate-700 flex flex-col'>
            <div className='md:flex flex-2'>
                <div className='p-4 flex-1 bg-[#16171d]'>
                    <div className='flex flex-col justify-between align-middle md:space-y-3'>
                        <div>
                            <p className='text-xl'>Admin</p>
                            <p className='text-slate-400'>Statistics</p>
                        </div>
                        <div className='border-t border-slate-700 mb-2'></div>
                        <div className='md:flex justify-evenly align-middle mt-4'>
                            <div className='p-4 border-y border-slate-700'>
                                <div className='bg-emerald-600 md:py-2 text-center rounded'>
                                    <p className='text-lg tracking-wider'>Products</p>
                                    <p className='text-sm text-slate-500'>Developing...</p>
                                    <p className='text-2xl font-bold'></p>
                                </div>
                                <div className='mt-2 text-center rounded'>
                                    <p className='text-sm text-slate-400 tracking-wider'>Categories</p>
                                    <p className='text-sm text-slate-600'>Developing...</p>
                                    <p className='text-lg font-bold'></p>
                                </div>
                                <div className='border-t border-slate-700 my-2'></div>
                                <div className='bg-amber-600 md:py-2 text-center rounded'>
                                    <p className='text-lg tracking-wider'>Users</p>
                                    <p className='text-sm text-slate-500'>Developing...</p>
                                    <p className='text-2xl font-bold'></p>
                                </div>
                                <div className='flex justify-center mt-2 gap-2 text-center'>
                                    <div>
                                        <p className='text-sm text-slate-400 tracking-wider'>Admins</p>
                                        <p className='text-sm text-slate-600'>Developing...</p>
                                        <p className='text-lg font-bold'></p>
                                    </div>

                                    <div className='border-r border-slate-700 mx-2'></div>
                                    <div>
                                        <p className='text-sm text-slate-400 tracking-wider'>Users</p>
                                        <p className='text-sm text-slate-600'>Developing...</p>
                                        <p className='text-lg font-bold'></p>
                                    </div>
                                </div>
                            </div>
                            <div className='md:w-52 p-4 border-x border-slate-700'>
                                <div className='bg-blue-600 md:w-44 py-2 text-center rounded'>
                                    <p className='text-lg tracking-wider'>Orders</p>
                                    <p className='text-2xl font-bold'>{formatNumber(stats.orders)}</p>
                                </div>
                                <div className='flex flex-col mt-2 gap-2 text-center'>
                                    <p className='text-sm text-slate-400 tracking-wider'>Pending</p>
                                    <p className='text-lg font-bold'>{formatNumber(stats.ordersPending)}</p>
                                    <div className='border-t border-slate-700 mb-2'></div>

                                    <p className='text-sm text-slate-400 tracking-wider'>Delivered</p>
                                    <p className='text-lg font-bold'>{formatNumber(stats.ordersDelivered)}</p>
                                    <div className='border-t border-slate-700 mb-2'></div>

                                    <p className='text-sm text-slate-400 tracking-wider'>Canceled</p>
                                    <p className='text-lg font-bold'>{formatNumber(stats.ordersCanceled)}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4 flex-1 md:w-1/2 bg-[#16171d] md:border-l border-t md:border-t-0 border-slate-700'>
                    <p className='text-xl'>Admin panel</p>
                    <p className='text-slate-400 text-sm mb-2'>Controls</p>
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
                                                        <p className='text-slate-300 text-sm tracking-tighter'>{formatINR(i.priceAtPurchased)}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className='text-right text-slate-300'>
                                            <p>Total price - {formatINR(item.totalPrice)}</p>
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
            </div>
        </div>
    )
}

export default Dashboard