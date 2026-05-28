import React, { useEffect, useState } from 'react'

const ControlPanel = ({
    isControlOpen,
    setIsControlOpen,
    fetchData,
    selectedProduct
}) => {

    const [stocks, setStocks] = useState(0);

    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        categoryId: 0,
        price: 0,
        stock: 0
    });
    const [disable, setDisable] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setProductDetails({
            ...productDetails,
            [name]:
                type === 'number'
                    ? Number(value)
                    : value
        });
    };

    useEffect(() => {
        if (selectedProduct) {
            setProductDetails({
                name: selectedProduct.name || "",
                description: selectedProduct.description || "",
                categoryId: String(selectedProduct.categoryId || ""),
                price: selectedProduct.price || "",
                stock: selectedProduct.stock || ""
            })
        }
    }, [selectedProduct])

    const handleRefill = async (productID) => {

        if (stocks <= 0) return;

        try {
            const res = await fetch(`/api/admin/product/refill/${productID}?stocks=${stocks}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                console.log("Something went wrong: ", res.status, " ", res.statusText);
                return;
            }
            fetchData();
            console.log(await res.text());
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    }

    const handleDelete = async (productID) => {
        try {
            const res = await fetch(`/api/admin/product/${productID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                console.log("Something went wrong: ", res);
                return;
            }
            fetchData();
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    const handleEdit = async (e, productID) => {
        e.preventDefault();
        setDisable(true);

        try {
            const res = await fetch(`/api/admin/product/${productID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productDetails),
                credentials: 'include'
            });

            fetchData?.();
            setIsControlOpen(false);
        } catch (error) {
            console.log("Something went wrong: ", error);
        } finally {
            setDisable(false);
        }
    }

    return (
        <div onClick={() => { setIsControlOpen(false) }} className={`fixed top-0 right-0 z-10 h-full w-64 px-6 py-5 text-center border-l border-slate-700 flex flex-col justify-between bg-[#16171d] text-white
			${isControlOpen ? "translate-x-0" : "translate-x-full"}
			transition-transform duration-300 ease-in-out`}>
            <div className='flex flex-col text-lg'>
                <div className={"text-2xl cursor-default hover:text-sky-400"}>Store</div>
                <div className='h-0 w-full border-t border-slate-700 my-1'></div>
                <div className='flex flex-col gap-2 mt-2'>
                    <p className='text-xl'>{selectedProduct.name}</p>
                    <div className='h-0 w-full border-t border-slate-700 my-1'></div>

                    <form onClick={(e) => { e.stopPropagation() }} onSubmit={(e) => { handleEdit(e, selectedProduct.id) }} className='space-y-2' >
                        <input onChange={(e) => { handleChange(e) }} value={productDetails.name} maxLength={30} required type="text" placeholder='Name' name='name' className='w-11/12 border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg' />
                        <select onChange={(e) => { handleChange(e) }} value={productDetails.categoryId} required name='categoryId' className='border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg'>
                            <option value="" disabled>Select category</option>
                            <option className='bg-black' value="1">Electronics</option>
                            <option className='bg-black' value="2">Clothing</option>
                            <option className='bg-black' value="3">Books</option>
                        </select>
                        <textarea onChange={(e) => { handleChange(e) }} value={productDetails.description} maxLength={240} required placeholder='Description' name='description' className='border resize-none border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg w-full' />
                        <input onChange={(e) => { handleChange(e) }} value={productDetails.price} min={0} type="number" required placeholder='Price' name='price' className='w-1/2 no-spinner border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg' />
                        <input onChange={(e) => { handleChange(e) }} value={productDetails.stock} min={0} type="number" required placeholder='Stock' name='stock' className='w-1/2 no-spinner border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg' />
                        <button type='submit' disabled={disable} className={`w-full transition-all cursor-pointer text-sky-400 hover:bg-sky-400 hover:text-black active:bg-sky-600 ${disable && "grayscale-100"}`}>Edit</button>
                    </form>

                    <div className='h-0 w-full border-t border-slate-700 my-1'></div>
                    <div onClick={(e) => { e.stopPropagation() }} className='flex flex-col gap-4'>
                        <input type="number" onChange={(e) => { setStocks(e.target.value) }} placeholder='Enter stocks' className='outline-none border border-slate-400 p-1 no-spinner' />
                        <button onClick={() => { handleRefill(selectedProduct.id) }} className={"transition-all cursor-pointer text-emerald-400 hover:bg-emerald-400 hover:text-black active:bg-emerald-600"}>Refill</button>
                    </div>
                    <div className='h-0 w-full border-t border-slate-700 my-1'></div>
                    <button onClick={() => { handleDelete(selectedProduct.id) }} className={"transition-all cursor-pointer text-rose-400 hover:bg-rose-400 hover:text-black active:bg-rose-600"}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default ControlPanel