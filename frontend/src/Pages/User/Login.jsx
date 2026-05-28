import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthProvider';

const Login = () => {

    const { user, fetchUser } = useAuth();

    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });

    const [response, setResponse] = useState();
    const [disable, setDisable] = useState(false);
    const [eye, setEye] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        setUserData({ ...userData, [e.target.name]: value });
    };

    const handleLogin = async () => {
        setDisable(true);
        try {
            const req = await fetch("/api/auth/login", {
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
                setResponse("Login failed");
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
            <div className='h-2/3 min-w-1/4 p-5 my-auto border border-slate-700 bg-[#1c1e29] flex justify-center align-middle flex-col'>
                <div className='flex'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tighter'>Login</h1>
                        <p className='text-sm mt-1 font-light text-slate-300'>Welcome back!</p>
                    </div>
                    <p className={`ml-auto mt-2 font-light ${response === "Login failed" ? "text-red-500" : "text-green-500"}`}>{response}</p>
                </div>
                <div className='flex flex-col mt-6'>
                    <p className='text-sm tracking-trighter text-slate-400 mb-0.5'>Username</p>
                    <input onChange={(e) => { handleChange(e) }} type="text" name="username" placeholder='Enter username' className='bg-[#252836] outline-none border border-slate-700 p-2  transition-all duration-200 hover:-translate-0.5 caret-purple-600 focus:border-purple-500' />
                    <p className='mt-2 text-sm tracking-trighter text-slate-400 mb-0.5'>Password</p>
                    <div className='bg-[#252836] flex justify-between border border-slate-700 p-2 transition-all duration-200 hover:-translate-0.5 caret-purple-600 focus-within:border-purple-500'>
                        <input onChange={(e) => { handleChange(e) }} type={eye ? "text" : "password"} name="password" placeholder='Enter password' className='outline-none' />
                        <button onClick={() => { toggleEye() }}>{eye ? "*_*" : "-_-"}</button>
                    </div>
                    <p className='text-right text-sm tracking-tight text-blue-500 mt-2 cursor-pointer hover:underline'>Forgot password?</p>
                </div>
                <button disabled={disable} onClick={(e) => { handleLogin(e) }} className={`mt-auto mx-auto border border-slate-700 bg-gray-600 h-fit w-full px-4 py-1 cursor-pointer hover:bg-slate-800 hover:-translate-0.5 transition-all duration-200 active:translate-0 ${disable ? "bg-white" : ""}`}>Login</button>
                <p className='mt-4 text-slate-300 text-center'>Not have an account ? <NavLink to={"/sign-up"} className='text-blue-500 hover:underline'>Sign up</NavLink></p>
            </div>
        </div>
    )
}

export default Login
