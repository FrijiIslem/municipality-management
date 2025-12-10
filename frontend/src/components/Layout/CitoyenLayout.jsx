import { Outlet } from 'react-router-dom'
import CitoyenSidebar from './CitoyenSidebar'
import CitoyenHeader from './CitoyenHeader'

const CitoyenLayout = () => {
  return (
    <div className="min-h-screen bg-light-gray">
      <CitoyenHeader />
      <div className="flex">
        <CitoyenSidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CitoyenLayout

