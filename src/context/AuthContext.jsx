import { createContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getEnv, getErrorMessage } from '../utils/helpers'

const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY')

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)
      setError(null)

      try {

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!mounted) return

        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
      } catch (e) {
        if (!mounted) return
        setSession(null)
        setUser(null)
        setError(getErrorMessage(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    if (!supabase) return () => {}

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
      }
    )

    return () => {
      mounted = false
      subscription?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => {
    const accessToken = session?.access_token ?? null

    async function signUp(email, password) {
      setError(null)
      setLoading(true)
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        return data
      } catch (e) {
        setError(getErrorMessage(e))
        throw e
      } finally {
        setLoading(false)
      }
    }

    async function signIn(email, password) {
      setError(null)
      setLoading(true)
      try {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })
        if (signInError) throw signInError
        return data
      } catch (e) {
        setError(getErrorMessage(e))
        throw e
      } finally {
        setLoading(false)
      }
    }

    async function signOut() {
      setError(null)
      setLoading(true)
      try {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
      } catch (e) {
        setError(getErrorMessage(e))
        throw e
      } finally {
        setLoading(false)
      }
    }

    return {
      session,
      user,
      accessToken,
      loading,
      error,
      signUp,
      signIn,
      signOut,
      setError,
    }
  }, [session, user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

