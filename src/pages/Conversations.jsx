import { useCallback, useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '../api/axiosInstance'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import { buildQuery, formatDateTime, getErrorMessage } from '../utils/helpers'
import './Conversations.css'

function normalizeListResponse(res, keyCandidates = []) {
  const data = res?.data
  for (const key of keyCandidates) {
    const maybe = data?.[key]
    if (Array.isArray(maybe)) return { list: maybe, total: data?.total ?? null }
  }
  if (Array.isArray(data?.data)) return { list: data.data, total: data?.total ?? null }
  if (Array.isArray(data)) return { list: data, total: null }

  const headerTotal = Number(res?.headers?.['x-total-count'])
  const total = Number.isFinite(headerTotal) ? headerTotal : data?.total ?? null
  return { list: [], total }
}

export default function Conversations() {
  const [agents, setAgents] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [agentId, setAgentId] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(null)

  const queryString = useMemo(() => {
    return buildQuery({ page, limit, agentId })
  }, [page, limit, agentId])

  const fetchAgents = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/elevenlabs/agents')
      const { list } = normalizeListResponse(res, ['agents'])
      setAgents(list)
    } catch {
      setAgents([])
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(
        `/api/elevenlabs/conversations${queryString}`
      )
      const { list, total: nextTotal } = normalizeListResponse(res, [
        'conversations',
      ])
      setConversations(list)
      setTotal(typeof nextTotal === 'number' ? nextTotal : null)
    } catch (e) {
      setError(getErrorMessage(e))
      setConversations([])
      setTotal(null)
    } finally {
      setLoading(false)
    }
  }, [queryString])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return (
    <div className="page conversations-page">
      <div className="page-title">
        <h2>Conversations</h2>
        <span className="muted">ElevenLabs</span>
      </div>

      <div className="card">
        <div className="row conversations-controls">
          <label className="conversations-filter">
            <span className="muted">Agent</span>
            <select
              value={agentId}
              onChange={(e) => {
                setPage(1)
                setAgentId(e.target.value)
              }}
            >
              <option value="">All agents</option>
              {agents.map((a) => {
                const id = a.id ?? a.agent_id
                const name = a.name ?? a.display_name ?? id
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              })}
            </select>
          </label>

          <div className="spacer" />
          <button className="btn btn-ghost" onClick={fetchConversations}>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="error conversations-error" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? <Loader label="Loading conversations..." /> : null}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="col-conv-id">ID</th>
                <th className="col-conv-agent">Agent</th>
                <th className="col-conv-started">Started</th>
                <th className="col-conv-status">Status</th>
                <th className="muted">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No conversations found.
                  </td>
                </tr>
              ) : null}

              {conversations.map((c) => (
                <tr key={c.id ?? c.conversation_id ?? JSON.stringify(c)}>
                  <td className="muted">{c.id ?? c.conversation_id ?? '—'}</td>
                  <td>{c.agentId ?? c.agent_id ?? c.agent ?? '—'}</td>
                  <td>{formatDateTime(c.startedAt ?? c.started_at ?? c.created_at)}</td>
                  <td>{c.status ?? '—'}</td>
                  <td className="muted">
                    <code className="code-block">
                      {JSON.stringify(c, null, 2)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          limit={limit}
          total={typeof total === 'number' ? total : undefined}
          onPageChange={(p) => setPage(Math.max(1, p))}
          onLimitChange={(n) => {
            setPage(1)
            setLimit(n)
          }}
        />
      </div>
    </div>
  )
}

