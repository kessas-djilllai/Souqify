/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';

import AdminLayout from './pages/admin/AdminLayout';
import DashboardStats from './pages/admin/DashboardStats';
import OrdersPage from './pages/admin/OrdersPage';
import ProductsPage from './pages/admin/ProductsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import CouponsPage from './pages/admin/CouponsPage';
import ShippingZonesPage from './pages/admin/ShippingZonesPage';
import SettingsPage from './pages/admin/SettingsPage';
import AppearancePage from './pages/admin/AppearancePage';

import SuperAdminLayout from './pages/super-admin/SuperAdminLayout';
import SuperAdminLogin from './pages/super-admin/SuperAdminLogin';
import AccountsPage from './pages/super-admin/AccountsPage';
import PlansPage from './pages/super-admin/PlansPage';
import MessagesPage from './pages/super-admin/MessagesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/factur" element={<InvoicePage />} />
        
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
           <Route path="dashboard" element={<DashboardStats />} />
           <Route path="orders" element={<OrdersPage />} />
           <Route path="products" element={<ProductsPage />} />
           <Route path="categories" element={<CategoriesPage />} />
           <Route path="appearance" element={<AppearancePage />} />
           <Route path="coupons" element={<CouponsPage />} />
           <Route path="shipping-zones" element={<ShippingZonesPage />} />
           <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin" element={<SuperAdminLayout />}>
           <Route index element={<Navigate to="/super-admin/accounts" replace />} />
           <Route path="accounts" element={<AccountsPage />} />
           <Route path="plans" element={<PlansPage />} />
           <Route path="messages" element={<MessagesPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

