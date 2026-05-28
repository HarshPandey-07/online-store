import React, { useEffect, useState } from 'react'

const Orders = () => {

  const [order, setOrder] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/user/order?page=${page}&size=4`, {
        credentials: "include"
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError("Not logged in");
        } else if (res.status === 403) {
          setError("Access denied");
        }
        return; // 🚨 stop here, don’t parse JSON
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
      });
    } catch (error) {
      setError(`Something went wrong ${error}`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchOrders();
  }, [page]);

  const pageForward = (e) => {
    e.preventDefault();
    if (page < pageInfo.totalPages - 1)
      setPage(prev => prev + 1);
  };
  const pageBackward = (e) => {
    e.preventDefault();
    if (page !== 0)
      setPage(page - 1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);

    if (isNaN(dateObj)) return "Invalid date";

    const displayDate = dateObj.toLocaleDateString('en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // hour12: true
    });
    return displayDate;
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/user/order/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        console.log("Cannot remove order: ", res.text);
        return;
      }
      fetchOrders();
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }

  return (
    <div className='md:mx-12 min-h-[calc(100dvh-86px)] bg-[#1c1e29] border-x border-x-slate-700'>
      {
        !loading && Object.keys(pageInfo).length === 0 ? <i>No items</i> :
          <div className='h-fit w-full bg-black border-b border-b-slate-700 p-1 pl-2 flex justify-between'>
            <p>{pageInfo.page + 1}-{pageInfo.totalPages} of {pageInfo.totalElements} results, and size of {pageInfo.size}</p>
            <div>
              <button onClick={pageBackward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${page === 0 ? "hidden" : ""}`}>Previous</button>
              <button onClick={pageForward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${pageInfo.totalPages === page + 1 ? "hidden" : ""}`}>Next</button>
            </div>
          </div>
      }
      <div className='w-full flex flex-wrap content-start justify-center gap-6 p-6'>
        <div className='h-fit w-full'><h2 className='text-4xl text-sky-400'>My Orders</h2></div>
        {
          loading ? <div className="loader"></div> :
            error ? <p>{error}</p> :
              order.length === 0
                ? <i>No orders yet!</i>
                : order.map(item => (
                  <div key={item.id} className='h-fit min-w-64 bg-slate-700 text-white rounded-xl shadow-lg p-4 hover:scale-105 transition cursor-pointer space-y-2'>
                    <div className='flex justify-between align-middle'>
                      <p className='text-slate-400 text-xs tracking-tight'>ID:{item.id}</p>
                      <button disabled={isCompleted[item.id]} onClick={() => { handleDelete(item.id) }} className={`p-0.5 px-2 bg-red-500 rounded-2xl hover:ring-2 active:ring-red-500 cursor-pointer transition ${isCompleted[item.id] && "hidden"}`}>Cancel</button>
                    </div>
                    <h3 className='text-center text-2xl'>Products</h3>
                    <div className='border bg-slate-600 min-h-28 flex flex-col justify-center align-middle gap-2'>
                      {
                        item.orderItems?.map(i => (
                          <div key={i.id} className='flex justify-center align-middle text-center gap-2'>
                            <p className='text-xl tracking-wider'>{i.product.name}</p>
                            <p className='text-slate-300 text-sm tracking-tighter'>{i.quantity}</p>
                            <p className='text-slate-300 text-sm tracking-tighter'>₹{i.priceAtPurchased}</p>
                          </div>
                        ))
                      }
                    </div>
                    <div className='text-right text-lg text-slate-300'>
                      <p>Total price - ₹{item.totalPrice}</p>
                      <p>Status - {item.status}</p>
                    </div>
                    <div className='text-sm text-slate-300'>
                      <p>{formatDate(item.createdAt)}</p>
                      <p>{item.user.username}</p>
                    </div>
                  </div>
                ))
        }
      </div>
    </div>
  )
}

export default Orders
