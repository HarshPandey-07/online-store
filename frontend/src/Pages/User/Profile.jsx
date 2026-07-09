import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../../utils/formatters';

const Profile = () => {

    const [order, setOrder] = useState([]);
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
                navigate('/');
            }
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    const fetchLastOrder = async () => {
        try {
            const res = await fetch(`/api/user/last-order`, {
                credentials: 'include'
            });
            if (!res.ok) {
                console.log("Something went wrong");
                return;
            }
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    useEffect(() => {
        fetchLastOrder();
    }, [order]);

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
        <div className='md:h-[calc(100dvh-86px)] md:mx-12 border-x border-x-slate-700 flex justify-center align-middle'>
            <div className='md:flex flex-2'>
                <div className='p-4 flex-1 bg-[#16171d]'>
                    <div className='flex justify-between align-middle h-1/2 flex-col'>
                        <div>
                            <p className='text-2xl'>Profile👤</p>
                        </div>
                        <div className='w-full my-2 border-t border-slate-700'></div>
                        <div className='text-left space-y-2'>
                            <div className='flex'>
                                <p className='text-xl p-1.5'>{user?.username}</p>
                                <abbr title="Edit" className='no-underline'><button className='hover:bg-white/40 active:bg-white/20 cursor-pointer p-1.5'>✒️</button></abbr>
                            </div>
                            <div className='w-full border-t border-sky-400'></div>
                            <div className='flex'>
                                <p className='text-xl p-1.5'>password</p>
                                <abbr title="Edit" className='no-underline'><button className='hover:bg-white/40 active:bg-white/20 cursor-pointer p-1.5'>✒️</button></abbr>
                            </div>
                            <div className='w-full border-t border-sky-400'></div>
                            <div className='flex'>
                                <p className='text-xl p-1.5'>{user?.email}</p>
                                <abbr title="Edit" className='no-underline'><button className='hover:bg-white/40 active:bg-white/20 cursor-pointer p-1.5'>✒️</button></abbr>
                            </div>
                            <button onClick={handleLogout} className='bg-red-500 h-10 w-20 p-2 text-lg rounded-xl cursor-pointer transition hover:ring-2 active:ring-violet-500 active:bg-rose-800'>Logout</button>
                        </div>
                    </div>
                </div>
                <div className='p-4 flex-1 md:w-1/2 bg-[#16171d] md:border-l border-t md:border-t-0 border-slate-700'>
                    <p className='text-xl'>Last order</p>
                    <div className='h-0 w-full border-t border-slate-700 my-4'></div>
                    <div className='flex justify-evenly align-middle gap-4 relative overflow-x-auto pb-1'>
                        {
                            order.length === 0
                                ? <i>No orders yet!</i>
                                :
                                <div className='h-fit min-w-54 bg-slate-700 text-white rounded-xl shadow-lg p-2 space-y-2'>
                                    <div className='flex justify-between align-middle'>
                                        <p className='text-slate-400 text-xs tracking-tight'>ID:{order.id}</p>
                                    </div>
                                    <h3 className='text-center text-xl'>Products</h3>
                                    <div className='border bg-slate-600 min-h-18 flex flex-col justify-center align-middle gap-2'>
                                        {
                                            order.orderItems.map(i => (
                                                <div key={i.id} className='flex justify-center align-middle text-center gap-2'>
                                                    <p className='text-lg tracking-wider'>{i.product}</p>
                                                    <p className='text-slate-300 text-sm tracking-tighter'>{i.quantity}</p>
                                                    <p className='text-slate-300 text-sm tracking-tighter'>{formatINR(i.priceAtPurchased)}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='text-right text-slate-300'>
                                        <p>Total price - {formatINR(order.totalPrice)}</p>
                                        <p>Status - {order.status}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='text-sm text-slate-300'>
                                            <p>{formatDate(order.createdAt)}</p>
                                            <p>{order.user.username}</p>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile