import React, { useState } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';

const MainLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation = useNavigation();
    return (
        <>
            <Navbar setIsSidebarOpen={setIsSidebarOpen} />
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Outlet />
            <Footer />
        </>
    )
}

export default MainLayout