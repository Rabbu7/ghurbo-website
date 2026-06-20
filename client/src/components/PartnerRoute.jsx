import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PartnerRoute({ children, type }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'partner' && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (user.role === 'admin') {
    return children
  }

  if (!user.isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-center px-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">
          Application Under Review
        </h1>
        <p className="text-on-surface-variant max-w-sm">
          Your partner application is being reviewed. We'll notify
          you once it's approved.
        </p>
      </div>
    )
  }

  if (type && user.partnerType !== type && user.partnerType !== 'both') {
    return <Navigate to={`/partner/${user.partnerType}`} replace />
  }

  return children
}
