import { useCallback, useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import { supabase } from '../context/AuthContext'
import { formatDateTime, getErrorMessage } from '../utils/helpers'
import './Logs.css'

function extractLogFields(row) {
  const action = row?.action ?? row?.event ?? row?.type ?? '—'
  const ts = row?.created_at ?? row?.timestamp ?? row?.time ?? null
  return { action, ts }
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(null)

  const range = useMemo(() => {
    const from = (page - 1) * limit
    const to = from + limit - 1
    return { from, to }
  }, [page, limit])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!supabase) {
        throw new Error(
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        )
      }

      let result = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(range.from, range.to)

      if (result.error?.message?.includes('created_at')) {
        result = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact' })
          .order('timestamp', { ascending: false })
          .range(range.from, range.to)
      }

      if (result.error) throw result.error
      setLogs(Array.isArray(result.data) ? result.data : [])
      setTotal(typeof result.count === 'number' ? result.count : null)
    } catch (e) {
      setError(getErrorMessage(e))
      setLogs([])
      setTotal(null)
    } finally {
      setLoading(false)
    }
  }, [range.from, range.to])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="page logs-page">
      <div className="page-title">
        <h2>Activity Logs</h2>
        <span className="muted">Supabase table: activity_logs</span>
      </div>

      <div className="card">
        <div className="row logs-controls">
          <span className="muted">
            Sorted by latest first • Table: <b>activity_logs</b>
          </span>
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={fetchLogs}>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="error logs-error" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? <Loader label="Loading logs..." /> : null}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="col-log-ts">Timestamp</th>
                <th>Action</th>
                <th className="muted">Raw</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} className="muted">
                    No logs found.
                  </td>
                </tr>
              ) : null}

              {logs.map((row) => {
                const { action, ts } = extractLogFields(row)
                return (
                  <tr key={row.id ?? `${action}-${ts}-${JSON.stringify(row)}`}>
                    <td className="muted">{formatDateTime(ts)}</td>
                    <td>{action}</td>
                    <td className="muted">
                      <code className="code-block">
                        {JSON.stringify(row, null, 2)}
                      </code>
                    </td>
                  </tr>
                )
              })}
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

