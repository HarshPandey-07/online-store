import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthProvider';

const Signup = () => {

    const { user, fetchUser } = useAuth();

    const [userData, setUserData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const [response, setResponse] = useState();
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const [eye, setEye] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSignUp = async () => {
        setDisable(true);
        try {
            const req = await fetch("/api/auth/sign-up", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });
            const res = await req.text();
            if (req.ok) {
                setResponse(res);
                fetchUser();
                navigate("/");
            }
            else {
                setResponse("Signup failed");
            }
        } catch (error) {
            console.log("Error", error);
        } finally {
            setDisable(false);
        }
    };

    const toggleEye = () => {
        setEye(!eye);
    }

    return (
        <div className='h-[calc(100dvh-56px)] md:mx-12 border-x border-x-slate-700 flex justify-center align-middle'>
            <div className='h-fit min-w-1/4 p-5 my-auto border border-slate-700 bg-[#1c1e29] flex justify-center align-middle flex-col'>
                <div className='flex'>
                    <div>
                        <h1 className='text-2xl font-bold'>Sign up</h1>
                        <p className='text-sm mt-1 font-light text-slate-300'>Welcome!</p>
                    </div>
                    <p className={`ml-auto mt-2 font-light ${response === "Signup failed" ? "text-red-500" : "text-green-500"}`}>{response}</p>
                </div>
                <div className='flex flex-col mt-2 space-y-2'>
                    <p className='text-sm tracking-trighter text-slate-400 mb-0.5'>Email</p>
                    <input onChange={(e) => { handleChange(e) }} type="email" name="username" placeholder='Enter username' className='bg-[#252836] outline-none border border-slate-700 p-2  transition-all duration-200 hover:-translate-0.5 caret-purple-600 focus:border-purple-500' />
                    <p className='text-sm tracking-trighter text-slate-400 mb-0.5'>Username</p>
                    <input onChange={(e) => { handleChange(e) }} type="text" name="username" placeholder='Enter username' className='bg-[#252836] outline-none border border-slate-700 p-2  transition-all duration-200 hover:-translate-0.5 caret-purple-600 focus:border-purple-500' />
                    <p className='text-sm tracking-trighter text-slate-400 mb-0.5'>Password</p>
                    <div className='bg-[#252836] flex justify-between border border-slate-700 p-2 transition-all duration-200 hover:-translate-0.5 caret-purple-600 focus-within:border-purple-500'>
                        <input onChange={(e) => { handleChange(e) }} type={eye ? "text" : "password"} name="password" placeholder='Enter password' className='outline-none' />
                        <button onClick={() => { toggleEye() }}>{eye ? "*_*" : "-_-"}</button>
                    </div>
                </div>
                <button disabled={disable} onClick={handleSignUp} className='mt-4 mx-auto border border-slate-700 bg-gray-600 h-fit w-full px-4 py-1 cursor-pointer hover:bg-slate-800 hover:-translate-0.5 transition-all duration-200 active:translate-0'>Sign Up</button>
                <p className='mt-4 text-slate-300 text-center'>Already have an account ? <NavLink to={"/login"} className='text-blue-500 hover:underline'>Login</NavLink></p>
            </div>
        </div>
    )
}

export default Signup
