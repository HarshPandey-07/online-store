import React from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigation } from 'react-router-dom'

const Layout = () => {
    const navigation = useNavigation();
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default Layout