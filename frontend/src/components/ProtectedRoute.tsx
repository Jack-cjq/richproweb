import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-silver-50">
        <div className="text-blue-600 font-medium">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

