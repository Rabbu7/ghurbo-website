import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PartnerGate() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'partner' || !user.isApproved) return
    if (location.pathname.startsWith('/partner')) return

    const target = user.partnerType === 'transport' ? '/partner/transport' : '/partner/hotel'
    navigate(target, { replace: true })
  }, [user, location.pathname, navigate])

  return null
}
