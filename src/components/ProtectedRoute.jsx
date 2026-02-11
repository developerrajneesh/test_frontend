import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from './Loader'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader label="Checking session..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

