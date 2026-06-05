import React from 'react'
import { useAuth } from '../../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

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
        <div className='h-[calc(100dvh-86px)] md:mx-12 border-x border-x-slate-700 flex justify-center align-middle'>
            <div className='h-1/2 w-64 mt-20 flex flex-col justify-between align-middle border-x items-center'>
                <div>
                    <p className='text-2xl'>Profile👤</p>
                    <div className='w-full my-1 border-t border-slate-400'></div>
                </div>
                <div className='w-full border-t border-slate-700'></div>
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
    )
}

export default Profile