import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="page dashboard-page">
      <div className="page-title">
        <h2>Dashboard</h2>
        <span className="muted">Quick access to core modules</span>
      </div>

      <div className="row dashboard-grid">
        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">Users</h3>
          <p className="muted">Search, filter, create, edit and soft-delete.</p>
          <Link className="btn btn-primary" to="/users">
            Manage Users
          </Link>
        </div>

        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">ElevenLabs Agents</h3>
          <p className="muted">List agents and trigger backend sync.</p>
          <Link className="btn btn-primary" to="/agents">
            View Agents
          </Link>
        </div>

        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">Conversations</h3>
          <p className="muted">Browse conversations by agent with pagination.</p>
          <Link className="btn btn-primary" to="/conversations">
            View Conversations
          </Link>
        </div>

        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">Activity Logs</h3>
          <p className="muted">Supabase table view: latest actions first.</p>
          <Link className="btn btn-primary" to="/logs">
            View Logs
          </Link>
        </div>
      </div>
    </div>
  )
}

