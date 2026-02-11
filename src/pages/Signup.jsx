import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'
import './Signup.css'

export default function Signup() {
  const { user, signUp, loading, error, setError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState(null)
  const [success, setSuccess] = useState(null)

  const redirectTo = useMemo(() => {
    return location.state?.from?.pathname || '/dashboard'
  }, [location.state])

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user, navigate, redirectTo])

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    setSuccess(null)
    setError?.(null)

    if (password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }

    try {
      const data = await signUp(email.trim(), password)

      const needsEmailConfirm = !data?.session
      if (needsEmailConfirm) {
        setSuccess(
          'Signup successful. Please check your email to confirm your account, then login.'
        )
      } else {
        navigate(redirectTo, { replace: true })
      }
    } catch (e2) {
      setLocalError(getErrorMessage(e2))
    }
  }

  return (
    <div className="container auth-page">
      <div className="page-title">
        <h2>Create account</h2>
        <span className="muted">Supabase Authentication</span>
      </div>

      <div className="card auth-card">
        {success ? <div className="success">{success}</div> : null}

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
              autoComplete="new-password"
              required
              placeholder="Create a strong password"
              minLength={8}
            />
          </label>

          <label>
            <span>Confirm password</span>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repeat password"
              minLength={8}
            />
          </label>

          <div className="row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Sign Up'}
            </button>
            <div className="spacer" />
            <Link to="/login" className="btn btn-ghost">
              Back to login
            </Link>
          </div>

          {loading ? <Loader label="Creating account..." /> : null}
        </form>
      </div>
    </div>
  )
}

