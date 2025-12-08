import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Containers from './pages/Containers'
import Notifications from './pages/Notifications'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="containers" element={<Containers />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  )
}

export default App

