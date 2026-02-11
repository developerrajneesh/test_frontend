import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'
import './Login.css'

export default function Login() {
  const { user, signIn, loading, error, setError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState(null)

  const redirectTo = useMemo(() => {
    return location.state?.from?.pathname || '/dashboard'
  }, [location.state])

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user, navigate, redirectTo])

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    setError?.(null)
    try {
      await signIn(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (e2) {
      setLocalError(getErrorMessage(e2))
    }
  }

  return (
    <div className="container auth-page">
      <div className="page-title">
        <h2>Login</h2>
        <span className="muted">Supabase Authentication</span>
      </div>

      <div className="card auth-card">
        {(localError || error) && (
          <div className="error" role="alert">
            {localError || error}
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <label>
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </label>

          <div className="row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
            <div className="spacer" />
            <Link to="/signup" className="btn btn-ghost">
              Create account
            </Link>
          </div>

          {loading ? <Loader label="Authenticating..." /> : null}
        </form>
      </div>
    </div>
  )
}

