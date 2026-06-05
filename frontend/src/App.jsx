import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Login from './Pages/User/Login'
import Footer from './Components/Footer'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './Pages/User/Signup'
import Orders from './Pages/User/Orders'
import MainLayout from './Components/MainLayout'
import AuthLayout from './Components/AuthLayout'
import { useEffect, useState } from 'react'
import Dashboard from './Pages/Admin/Dashboard'
import AuthProvider from './Context/AuthProvider'
import AddProduct from './Pages/Admin/AddProduct'
import AdminOrders from './Pages/Admin/Orders'
import Products from './Pages/Admin/ProductsPage/Products'
import Profile from './Pages/User/Profile'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "orders", element: <Orders /> },
        { path: "admin/dashboard", element: <Dashboard /> },
        { path: "admin/add-product", element: <AddProduct /> },
        { path: "admin/orders", element: <AdminOrders /> },
        { path: "admin/products", element: <Products /> },
        { path: "user/profile", element: <Profile /> }
      ]
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "sign-up", element: <Signup /> }
      ]
    }
  ])

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
