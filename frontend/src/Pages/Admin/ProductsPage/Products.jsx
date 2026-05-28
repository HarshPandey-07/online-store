import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthProvider';
import ControlPanel from './ControlPanel';

const Products = () => {
    const { user } = useAuth();

    if(user === null || user?.role !== 'admin') return;

    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [disable, setDisable] = useState(false);

    const [isControlOpen, setIsControlOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

    const [results, setResults] = useState([]);
    const [search, setSearch] = useState({
        keyword: ""
    });

    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/product?page=${page}&size=10`);
            if (res.ok) {
                const data = await res.json();

                setProducts(data.content);
                setPageInfo({
                    page: data.page,
                    size: data.size,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages
                })
            }
        } catch (error) {
            setError("Something went wrong", error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

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

    const openControl = (product) => {
        setIsControlOpen(true);
        setSelectedProduct(product);
    };

    const handleSearch = async () => {
        if (search.keyword === null || search.keyword === "")
            return;

        try {
            const res = await fetch(`/api/product/search?keyword=${search.keyword}`);
            if (!res.ok) {
                console.log("Something went wrong: ", res.statusText);
                return;
            }
            const data = await res.json();

            setResults(data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className={`md:mx-12 min-h-[calc(100dvh-86px)] border-x bg-[#1c1e29] border-slate-700`}>

            <ControlPanel isControlOpen={isControlOpen} setIsControlOpen={setIsControlOpen} fetchData={fetchData} selectedProduct={selectedProduct} />

            {
                !pageInfo || Object.keys(pageInfo).length === 0 ? <i>No items</i> :
                    <div className='h-fit w-full bg-black border-b border-b-slate-700 p-1 pl-2 flex justify-between'>
                        <p>{pageInfo.page + 1}-{pageInfo.totalPages} of {pageInfo.totalElements} results, and size of {pageInfo.size}</p>
                        <div>
                            <button onClick={pageBackward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${page === 0 ? "hidden" : ""}`}>Previous</button>
                            <button onClick={pageForward} className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${pageInfo.totalPages === page + 1 ? "hidden" : ""}`}>Next</button>
                        </div>
                    </div>
            }
            <div className='w-full h-10 text-center flex justify-center align-middle mt-1'>
                <div className='w-1/2 border border-slate-500 flex focus:border-sky-500 shadow-2xl shadow-gray-500 text-lg'>
                    <input onChange={(e) => { setSearch({ ...search, [e.target.name]: e.target.value }) }} type="search" name="keyword" placeholder='Search' className='flex-1 outline-none border-r border-slate-500 text-slate-200 py-0.5 px-2 caret-sky-300' />
                    <button onClick={() => { handleSearch() }} className='px-2 cursor-pointer transition hover:bg-blue-950 active:bg-sky-800'>🔍</button>
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-6 p-4">
                {
                    loading ? <div className='loader'></div> :
                        error ? <p>{error}</p> :
                            results.length !== 0 ?
                                results.map(product => (
                                    <div
                                        key={product?.id}
                                        className="h-52 w-64 bg-slate-700 relative flex flex-col justify-end text-white rounded-xl shadow-lg p-4"
                                    >
                                        <div className='absolute top-0 right-0 flex gap-2 p-3'>
                                            <div onClick={() => { openControl(product) }} className='p-1 h-fit w-8 text-center rounded-full cursor-pointer transition hover:bg-slate-400'>⋮</div>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">{product?.name}</h2>
                                        <p className="text-sm text-gray-300">{product?.description}</p>
                                        <p className='font-light'>₹{product?.price}</p>
                                        <p className='text-xs text-gray-400'>Category: {product?.categoryName}</p>
                                        <p className={`text-xs font-extralight' ${(product?.stock < 25) ? "text-red-400" : "text-green-400"}`}>{product?.stock}</p>
                                    </div>
                                ))
                                :
                                products.length === 0 ? <i>No products yet!</i> :
                                    products.map(product => (
                                        <div
                                            key={product?.id}
                                            className="h-52 w-64 bg-slate-700 relative flex flex-col justify-end text-white rounded-xl shadow-lg p-4"
                                        >
                                            <div className='absolute top-0 right-0 flex gap-2 p-3'>
                                                <div onClick={() => { openControl(product) }} className='p-1 h-fit w-8 text-center rounded-full cursor-pointer transition hover:bg-slate-400'>⋮</div>
                                            </div>
                                            <h2 className="text-lg font-bold mb-2">{product?.name}</h2>
                                            <p className="text-sm text-gray-300">{product?.description}</p>
                                            <p className='font-light'>₹{product?.price}</p>
                                            <p className='text-xs text-gray-400'>Category: {product?.categoryName}</p>
                                            <p className={`text-xs font-extralight' ${(product?.stock < 25) ? "text-red-400" : "text-green-400"}`}>{product?.stock}</p>
                                        </div>
                                    ))
                }
            </div>
        </div>
    )
}

export default Products