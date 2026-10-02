import { LogOut, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-mark">
          <Sparkles />
        </span>
        AI PR Reviewer
      </Link>
      <div className="navbar-user">
        <img src={user.avatar_url} alt={user.github_username} className="avatar" />
        <span className="navbar-user-name">{user.github_username}</span>
        <button className="btn btn-small btn-ghost" onClick={handleLogout}>
          <LogOut />
          Çıkış
        </button>
      </div>
    </nav>
  )
}
