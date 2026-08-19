import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-sm text-ink/40">
      Loading…
    </div>
  )
}

function AppRoutes() {
  const { session, role, loading } = useAuth()

  if (loading) return <Loader />

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/me" replace />
        }
      />
      <Route
        path="/admin"
        element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/me" replace />}
      />
      <Route path="/me" element={<EmployeeDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
