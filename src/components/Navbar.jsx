import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand">Admin Console</div>
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/users" className="nav-link">
            Users
          </NavLink>
          <NavLink to="/agents" className="nav-link">
            Agents
          </NavLink>
          <NavLink to="/conversations" className="nav-link">
            Conversations
          </NavLink>
          <NavLink to="/logs" className="nav-link">
            Activity Logs
          </NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          {user?.email ? <span className="muted">{user.email}</span> : null}
        </div>
        <NavLink to="/logout" className="btn btn-ghost">
          Logout
        </NavLink>
      </div>
    </header>
  )
}

