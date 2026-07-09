import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { formatINR } from '../../utils/formatters';

const Orders = () => {


    const [order, setOrder] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [page, setPage] = useState(0);
    const [isCompleted, setIsCompleted] = useState({});

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchAdminOrder = async () => {
        try {
            const res = await fetch(`/api/admin/order?page=${page}&size=4`, {
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

    if (user === null || user?.role !== 'admin') {
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
        <div className='md:mx-12 min-h-[calc(100dvh-86px)] px-2 bg-[#1c1e29] border-x border-x-slate-700'>
            {
                !pageInfo || Object.keys(pageInfo).length === 0 ? <i>No items</i> :
                    <div className='h-fit w-full border-b border-b-slate-700 p-1 pl-2 flex justify-between'>
                        <p>{pageInfo.page + 1}-{pageInfo.totalPages} of {pageInfo.totalElements} results, and size of {pageInfo.size}</p>
                        <div>
                            <button onClick={pageBackward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${page === 0 ? "hidden" : ""}`}>Previous</button>
                            <button onClick={pageForward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${pageInfo.totalPages === page + 1 ? "hidden" : ""}`}>Next</button>
                        </div>
                    </div>
            }
            <div className='h-fit w-full'><h2 className='text-4xl text-sky-400 m-2'>Orders</h2></div>
            <div className='w-full flex flex-wrap content-start justify-center gap-6 p-6'>
                {
                    order.length === 0
                        ? <i>No orders yet!</i>
                        : order.map(item => (
                            <div key={item.id} className='h-fit min-w-54 bg-slate-700 text-white rounded-xl shadow-lg p-4 space-y-2'>
                                <div className='flex justify-between align-middle'>
                                    <p className='text-slate-400 text-xs tracking-tight'>ID:{item.id}</p>
                                    <button disabled={isCompleted[item.id]} onClick={() => { handleCancel(item.id) }} className={`p-0.5 px-2 bg-red-500 rounded-2xl hover:ring-2 active:ring-red-500 cursor-pointer transition ${isCompleted[item.id] && "hidden"}`}>Cancel</button>
                                </div>
                                <h3 className='text-center text-2xl'>Products</h3>
                                <div className='border bg-slate-600 min-h-18 flex flex-col justify-center align-middle gap-2'>
                                    {
                                        item.orderItems.map(i => (
                                            <div key={i.id} className='flex justify-center align-middle text-center gap-2'>
                                                <p className='text-xl tracking-wider'>{i.product}</p>
                                                <p className='text-slate-300 text-sm tracking-tighter'>{i.quantity}</p>
                                                <p className='text-slate-300 text-sm tracking-tighter'>{formatINR(i.priceAtPurchased)}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='text-right text-slate-300'>
                                    <p>Total price - {formatINR(item.totalPrice)}</p>
                                    <p className={`${!isCompleted[item.id] && "text-sky-400"}`}>Status - {item.status}</p>
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
    )
}

export default Orders