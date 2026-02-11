import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Logout from './pages/Logout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Agents from './pages/Agents'
import Conversations from './pages/Conversations'
import Logs from './pages/Logs'

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/users"
              element={
                <AppLayout>
                  <Users />
                </AppLayout>
              }
            />
            <Route
              path="/agents"
              element={
                <AppLayout>
                  <Agents />
                </AppLayout>
              }
            />
            <Route
              path="/conversations"
              element={
                <AppLayout>
                  <Conversations />
                </AppLayout>
              }
            />
            <Route
              path="/logs"
              element={
                <AppLayout>
                  <Logs />
                </AppLayout>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
