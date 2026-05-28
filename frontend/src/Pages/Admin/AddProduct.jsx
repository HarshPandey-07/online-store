import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';

const AddProduct = () => {

    const {user} = useAuth();

    if(user === null || user?.role !== 'admin') return;

    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        categoryId: 0,
        price: 0,
        stock: 0
    });
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => { setProductDetails({ ...productDetails, [e.target.name]: e.target.value }) };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisable(true);
        try {
            const res = await fetch("/api/admin/product", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: productDetails.name,
                    description: productDetails.description,
                    categoryId: productDetails.categoryId,
                    price: productDetails.price,
                    stock: productDetails.stock,
                }),
                credentials: 'include'
            });
            navigate("/user");
        } catch (error) {
            console.log("Something went wrong", error);
        } finally {
            setDisable(false);
        }
    };

    return (
        <div className='h-[calc(100dvh-86px)] md:mx-12 bg-[#1c1e29] border-x border-x-slate-700 flex flex-col'>
            <h1 className='text-center my-4 text-2xl'>Add Product</h1>
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <div className='h-full w-full p-12 space-y-6 space-x-4'>
                    <input onChange={(e) => { handleChange(e) }} maxLength={30} required type="text" placeholder='Name' name='name' className='border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg text-lg' />
                    <select onChange={(e) => { handleChange(e) }} defaultValue="" required name='categoryId' className='border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg text-lg'>
                        <option value="" disabled>Select category</option>
                        <option className='bg-black' value="1">Electronics</option>
                        <option className='bg-black' value="2">Books</option>
                        <option className='bg-black' value="3">Clothing</option>
                    </select>
                    <textarea onChange={(e) => { handleChange(e) }} maxLength={240} required placeholder='Description' name='description' className='border resize-none border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg text-lg w-full' />
                    <input onChange={(e) => { handleChange(e) }} min={0} type="number" required placeholder='Price' name='price' className='no-spinner border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg text-lg' />
                    <input onChange={(e) => { handleChange(e) }} min={0} type="number" required placeholder='Stock' name='stock' className='no-spinner border border-slate-700 outline-none focus:border-slate-400 p-2 rounded-lg text-lg' />
                    <div className='flex justify-evenly align-middle mt-4'>
                        <button type="reset" className='text-lg p-1 px-2 w-1/4 rounded-xl transition cursor-pointer hover:ring-2 active:ring-red-600 bg-red-600'>Reset</button>
                        <button disabled={disable ? true : false} type="submit" className={`text-lg p-1 px-2 w-1/4 rounded-xl transition cursor-pointer hover:ring-2 active:ring-green-600 bg-green-600 ${disable && "grayscale-100"}`}>Add</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddProduct