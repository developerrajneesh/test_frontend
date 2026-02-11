 
import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/axiosInstance'
import Loader from '../components/Loader'
import { formatDateTime, getErrorMessage } from '../utils/helpers'
import './Agents.css'

function normalizeAgentsResponse(res) {
  const data = res?.data
  const list = data?.data || data?.agents || data
  const agents = Array.isArray(list) ? list : []

  const syncedAt =
    data?.lastSyncedAt || data?.syncedAt || data?.last_synced_at || null

  return { agents, syncedAt }
}

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSyncedAt, setLastSyncedAt] = useState(null)

  async function fetchAgents({ sync = false } = {}) {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(
        sync ? '/api/elevenlabs/agents?sync=true' : '/api/elevenlabs/agents'
      )
      const { agents: list, syncedAt } = normalizeAgentsResponse(res)
      setAgents(list)
      setLastSyncedAt(syncedAt || new Date().toISOString())
    } catch (e) {
      setError(getErrorMessage(e))
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return (
    <div className="page agents-page">
      <div className="page-title">
        <h2>ElevenLabs Agents</h2>
        <button
          className="btn btn-primary"
          onClick={() => fetchAgents({ sync: true })}
          disabled={loading}
        >
          {loading ? 'Syncing…' : 'Sync Agents'}
        </button>
      </div>

      <div className="card">
        <div className="row agents-controls">
          <span className="muted">
            Last synced: <b>{formatDateTime(lastSyncedAt)}</b>
          </span>
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={() => fetchAgents()}>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="error agents-error" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? <Loader label="Loading agents..." /> : null}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="col-agent-id">ID</th>
                <th>Name</th>
                <th className="muted">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} className="muted">
                    No agents found.
                  </td>
                </tr>
              ) : null}

              {agents.map((a) => (
                <tr key={a.id ?? a.agent_id ?? a.name}>
                  <td className="muted">{a.id ?? a.agent_id ?? '—'}</td>
                  <td>{a.name ?? a.display_name ?? '—'}</td>
                  <td className="muted">
                    <code className="code-block">
                      {JSON.stringify(a, null, 2)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

