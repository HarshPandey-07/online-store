import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { formatINR } from '../utils/formatters';

const Home = () => {

	const { user } = useAuth();

	const [products, setProducts] = useState([]);
	const [quantities, setQuantities] = useState({});
	const [pageInfo, setPageInfo] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(0);
	const [disable, setDisable] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [productDetails, setProductDetails] = useState(null);
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

				const initialQty = {};
				data.content.forEach(product => {
					initialQty[product.id] = 1;
				});

				setQuantities(initialQty);

				setProducts(data.content);
				setPageInfo({
					page: data.page,
					size: data.size,
					totalElements: data.totalElements,
					totalPages: data.totalPages
				})
			}
		} catch (error) {
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [page]);

	const updateQuantity = (productId, value, stock) => {
		const qty = Math.max(1, Math.min(stock, Number(value)));

		setQuantities(prev => ({
			...prev,
			[productId]: qty
		}));
	};

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

	const handleOrder = async (productId, quantity) => {
		if (user === null) {
			setDisable(true);
			console.log("User not logged in");
			return;
		}

		setDisable(true);

		try {
			const res = await fetch('/api/user/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					"items": [
						{
							"productId": productId,
							"quantity": quantity
						}
					]
				}),
				credentials: 'include'
			})

			if (!res.ok) {
				console.log("Something went worng while sending order", res.status, res.statusText);
				return;
			}

			console.log(res.text());
		} catch (error) {
			console.log("Something went wrong", error);
		} finally {
			setDisable(false);
			setIsProcessing(false);
			setProductDetails(null);
			fetchData();
		}
	}

	const handlePlaceOrder = (product, quantity) => {
		if (disable) return;

		setProductDetails({
			id: product.id,
			name: product,
			price: formatINR(quantity * product.price),
			quantity: quantity
		});

		setIsProcessing(true);
	}

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
				<div className='flex shadow-2xl shadow-gray-500 text-lg'>
					<input onChange={(e) => { setSearch({ ...search, [e.target.name]: e.target.value }) }} type="search" name="keyword" placeholder='Search' className='flex-1 outline-none border border-slate-500 text-slate-200 py-0.5 px-2 caret-sky-300 focus:border-sky-500' />
					<button onClick={() => { handleSearch() }} className='px-2 cursor-pointer border-y border-r border-slate-500 transition hover:bg-blue-950 active:bg-sky-800'>🔍</button>
				</div>
			</div>
			<div className="w-full flex flex-wrap justify-center gap-6 p-2">
				{
					loading ? <div className='loader'></div> :
						error ? <p>{error}</p> :
							results.length !== 0 ?
								results.map(product => (
									<div
										key={product?.id}
										className="h-52 w-64 bg-slate-700 flex flex-col justify-end text-white rounded-xl shadow-lg p-4"
									>
										<h2 className="text-lg font-bold mb-2">{product?.name}</h2>
										<p className="text-sm text-gray-300">{product?.description}</p>
										<p className='font-light'>{formatINR(product?.price)}</p>
										<p className='text-xs text-gray-400'>Category: {product?.categoryName}</p>
										<p className={`text-xs font-extralight' ${(product?.stock < 25) ? "text-red-400" : "text-green-400"}`}>{product?.stock}</p>
										<div className="flex items-center gap-2 mb-2">
											<button
												onClick={() =>
													updateQuantity(
														product.id,
														quantities[product.id] - 1,
														product.stock
													)
												}
												className="bg-slate-600 px-3 rounded hover:bg-slate-500"
											>
												-
											</button>

											<input
												type="number"
												value={quantities[product.id] || 1}
												min={1}
												max={product.stock}
												onChange={(e) =>
													updateQuantity(
														product.id,
														e.target.value,
														product.stock
													)
												}
												className="w-16 text-center bg-slate-800 rounded outline-none no-spinner"
											/>

											<button
												onClick={() =>
													updateQuantity(
														product.id,
														quantities[product.id] + 1,
														product.stock
													)
												}
												className="bg-slate-600 px-3 rounded hover:bg-slate-500"
											>
												+
											</button>
										</div>
										<button disabled={disable} onClick={() => { handlePlaceOrder(product, quantities[product.id]) }} className='bg-sky-700 rounded cursor-pointer active:bg-sky-800 disabled:grayscale transition hover:-translate-0.5 disabled:translate-0'>
											{disable ? "Processing...." : "Place order"}
										</button>
									</div>
								))
								:
								products.length === 0 ? <i>No products yet!</i> :
									products.map(product => (
										<div
											key={product?.id}
											className="h-52 w-64 bg-slate-700 flex flex-col justify-end text-white rounded-xl shadow-lg p-4"
										>
											<h2 className="text-lg font-bold mb-2">{product?.name}</h2>
											<p className="text-sm text-gray-300">{product?.description}</p>
											<p className='font-light'>{formatINR(product?.price)}</p>
											<p className='text-xs text-gray-400'>Category: {product?.categoryName}</p>
											<p className={`text-xs font-extralight' ${(product?.stock < 25) ? "text-red-400" : "text-green-400"}`}>{product?.stock}</p>
											<div className="flex items-center gap-2 mb-2">
												<button
													onClick={() =>
														updateQuantity(
															product.id,
															quantities[product.id] - 1,
															product.stock
														)
													}
													className="bg-slate-600 px-3 rounded hover:bg-slate-500"
												>
													-
												</button>

												<input
													type="number"
													value={quantities[product.id] || 1}
													min={1}
													max={product.stock}
													onChange={(e) =>
														updateQuantity(
															product.id,
															e.target.value,
															product.stock
														)
													}
													className="w-16 text-center bg-slate-800 rounded outline-none no-spinner"
												/>

												<button
													onClick={() =>
														updateQuantity(
															product.id,
															quantities[product.id] + 1,
															product.stock
														)
													}
													className="bg-slate-600 px-3 rounded hover:bg-slate-500"
												>
													+
												</button>
											</div>
											<button disabled={disable} onClick={() => { handlePlaceOrder(product, quantities[product.id]) }} className='bg-sky-700 rounded cursor-pointer active:bg-sky-800 disabled:grayscale transition hover:-translate-0.5 disabled:translate-0'>
												{disable ? "Processing...." : "Place order"}
											</button>
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
												setProductDetails(null);
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

										<p className="mt-4 text-lg text-slate-300">
											Confirm your order of{" "}
											<strong className="text-white">
												{productDetails?.quantity}
											</strong>{" "}
											of{" "}
											<strong className="text-white">
												{productDetails?.name}
											</strong>{" "}
											for{" "}
											<strong className="text-white">
												{productDetails?.price}
											</strong>
										</p>

										<div className="mt-8 flex gap-3">
											<button
												onClick={() =>
													handleOrder(
														productDetails.id,
														productDetails.quantity
													)
												}
												className="w-full rounded-2xl bg-green-500 p-2 text-lg cursor-pointer"
											>
												Confirm
											</button>

											<button
												onClick={() => {
													setIsProcessing(false);
													setProductDetails(null);
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

export default Home