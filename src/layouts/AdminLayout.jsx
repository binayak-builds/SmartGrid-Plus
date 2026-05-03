import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function AdminLayout() {
  return (
    <div className="app-layout">
      <Sidebar variant="admin" />
      <main className="main-content">
        <TopBar />
        <Outlet />
      </main>
    </div>
  )
}
