import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import BackendConnectionAlert from '../BackendConnectionAlert'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-light-gray">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          <BackendConnectionAlert />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

