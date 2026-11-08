import React, { useEffect, useState } from 'react'
import { formatINR } from '../../utils/formatters';
import { useAuth } from '../../Context/AuthProvider';

const Cart = () => {

    const { user } = useAuth();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [disable, setDisable] = useState(true);
    const [quantities, setQuantities] = useState({});

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/cart", {
                credentials: "include"
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError("User not logged in");
                } else if (res.status === 403) {
                    setError("Access denied");
                }
                return;
            }

            const data = await res.json();
            if (data.items.length > 0) {
                setDisable(false);
            }
            setCart(data.items);
        } catch (error) {
            setError(`Something went wrong ${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, [])

    const handlePlaceOrder = () => {
        if (disable) return;
        setIsProcessing(true);
    }

    const handleOrder = async () => {
        if (user === null) {
            setDisable(true);
            console.log("User not logged in");
            return;
        }

        setDisable(true);

        try {
            const res = await fetch('/api/user/order/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })

            if (!res.ok) {
                console.log("Something went worng while sending order", res.status, res.statusText);
                return;
            }

            console.log(await res.text());
        } catch (error) {
            console.log("Something went wrong", error);
        } finally {
            setIsProcessing(false);
            fetchCart();
        }
    }

    const handleClearCart = async () => {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })

            if (!res.ok) {
                console.log("Something went worng while sending order", res.status, res.statusText);
                return;
            }

            setDisable(true);
        } catch (error) {
            console.log(`Something went wrong ${error}`);
        } finally {
            fetchCart();
        }
    }

    return (
        <div className='md:mx-12 min-h-[calc(100dvh-86px)] bg-[#1c1e29] border-x border-x-slate-700'>
            <div className='w-full flex flex-wrap content-start justify-center gap-6 p-6'>
                <div className='h-fit w-full flex justify-between'>
                    <h2 className='text-4xl text-sky-400'>Cart Items</h2>
                    <div className='flex gap-4'>
                        {!disable &&
                            <>
                                <button onClick={() => { handleClearCart() }} className='bg-rose-600 p-2 text-xl tracking-wide rounded cursor-pointer active:bg-rose-800 transition hover:-translate-0.5 hover:bg-rose-700'>
                                    Clear cart
                                </button>
                                <button onClick={() => { handlePlaceOrder(quantities[cart.productId]) }} className='bg-sky-700 py-2 px-4 text-xl tracking-wide rounded cursor-pointer active:bg-sky-800 transition hover:-translate-0.5 hover:bg-amber-600'>
                                    Order
                                </button>
                            </>
                        }
                    </div>
                </div>
                {
                    loading ? <div className="loader"></div> :
                        error ? <p>{error}</p> :
                            cart.length === 0
                                ? <i>No products added yet!</i>
                                : cart.map(item => (
                                    <div key={item.productId} className='h-fit min-w-64 bg-slate-700 text-white rounded-xl shadow-lg p-4 cursor-pointer space-y-2'>
                                        <h3 className='text-center text-2xl'>{item.productName}</h3>
                                        <p className='text-slate-300 text-sm tracking-tighter'>Quantity - {item.quantity}</p>
                                        <p className='text-slate-300 text-sm tracking-tighter'>Price - {formatINR(item.price)}</p>
                                    </div>
                                ))
                }
            </div>
            {
                isProcessing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="w-[90%] max-w-md rounded-2xl bg-[#353c5f] p-6 text-white shadow-2xl">

                            {
                                user === null ? (
                                    <>
                                        <p className="text-xl tracking-wide">
                                            Please login first!
                                        </p>

                                        <button
                                            onClick={() => {
                                                setIsProcessing(false);
                                            }}
                                            className="mt-5 w-full rounded-2xl bg-amber-500 p-2 text-lg cursor-pointer"
                                        >
                                            Ok
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl tracking-tight text-rose-400">
                                            Order confirmation!
                                        </p>

                                        <div className="mt-8 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    handleOrder()
                                                }
                                                className="w-full rounded-2xl bg-green-500 p-2 text-lg cursor-pointer"
                                            >
                                                Confirm
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsProcessing(false);
                                                }}
                                                className="w-full rounded-2xl bg-red-500 p-2 text-lg cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Cart