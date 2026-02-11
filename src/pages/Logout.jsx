import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'
import './Logout.css'

export default function Logout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        await signOut()
        navigate('/login', { replace: true })
      } catch (e) {
        if (!mounted) return
        setError(getErrorMessage(e))
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [signOut, navigate])

  return (
    <div className="container auth-page">
      <div className="card auth-card">
        {error ? (
          <div className="error" role="alert">
            {error}
          </div>
        ) : null}
        <Loader label="Signing out..." />
      </div>
    </div>
  )
}

