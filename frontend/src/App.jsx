import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import CitoyenLayout from './components/Layout/CitoyenLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Containers from './pages/Containers'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTours from './pages/admin/AdminTours'
import AdminContainers from './pages/admin/AdminContainers'
import AdminIncidents from './pages/admin/AdminIncidents'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminNotifications from './pages/admin/AdminNotifications'

// Citoyen pages
import CitoyenDashboard from './pages/citoyen/CitoyenDashboard'
import CitoyenIncidents from './pages/citoyen/CitoyenIncidents'
import CitoyenContainers from './pages/citoyen/CitoyenContainers'
import CitoyenNotifications from './pages/citoyen/CitoyenNotifications'
import CitoyenProfile from './pages/citoyen/CitoyenProfile'

import CitoyenCalendar from './pages/citoyen/CitoyenCalendar'





function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

      <Route path="/home" element={<Home />} />

      <Route path="/register" element={<Register />} />
      
      {/* Agent routes */}
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="containers" element={<Containers />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="containers" element={<AdminContainers />} />
        <Route path="incidents" element={<AdminIncidents />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* Citoyen routes */}
      <Route path="/citoyen" element={<ProtectedRoute requiredRole="CITOYEN"><CitoyenLayout /></ProtectedRoute>}>
        <Route index element={<CitoyenDashboard />} />
        <Route path="incidents" element={<CitoyenIncidents />} />
        <Route path="containers" element={<CitoyenContainers />} />
        <Route path="notifications" element={<CitoyenNotifications />} />

        <Route path="calendar" element={<CitoyenCalendar />} />

        <Route path="profile" element={<CitoyenProfile />} />
      </Route>
    </Routes>
  )
}

export default App

