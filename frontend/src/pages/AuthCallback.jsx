import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login')
      return
    }

    loginWithToken(token)
      .then(() => navigate('/'))
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="centered-page">
      <div className="loading-row">
        <div className="spinner" />
        Giriş yapılıyor...
      </div>
    </div>
  )
}
