import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { CartProvider } from './store.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Reserve from './pages/Reserve.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Checkout from './pages/Checkout.jsx'
import Order from './pages/Order.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'menu', Component: Menu },
      { path: 'reservations', Component: Reserve },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'checkout', Component: Checkout },
      { path: 'order/:id', Component: Order },
      { path: 'admin', Component: Admin },
      { path: '*', Component: NotFound },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)
