import { useCallback, useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '../api/axiosInstance'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { buildQuery, getErrorMessage } from '../utils/helpers'
import './Users.css'

function normalizeUsersResponse(res) {
  const data = res?.data
  const list = data?.data || data?.users || data
  const users = Array.isArray(list) ? list : []

  const headerTotal = Number(res?.headers?.['x-total-count'])
  const total =
    typeof data?.total === 'number'
      ? data.total
      : Number.isFinite(headerTotal)
        ? headerTotal
        : null

  return { users, total }
}

function UserForm({ initial, onCancel, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [role, setRole] = useState(initial?.role ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'active')

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.({
          name: name.trim(),
          email: email.trim(),
          role: role.trim(),
          status: status.trim(),
        })
      }}
    >
      <label>
        <span>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Doe"
        />
      </label>

      <label>
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="jane@company.com"
        />
      </label>

      <div className="row">
        <label className="users-form-col">
          <span>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All / Unset</option>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="user">user</option>
          </select>
        </label>

        <label className="users-form-col">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="deleted">deleted</option>
          </select>
        </label>
      </div>

      <div className="row">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function Users() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)
  const [mutating, setMutating] = useState(false)

  const queryString = useMemo(() => {
    return buildQuery({ page, limit, search, role, status })
  }, [page, limit, search, role, status])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(`/api/users${queryString}`)
      const { users: nextUsers, total: nextTotal } =
        normalizeUsersResponse(res)
      setUsers(nextUsers)
      setTotal(nextTotal)
    } catch (e) {
      setError(getErrorMessage(e))
      setUsers([])
      setTotal(null)
    } finally {
      setLoading(false)
    }
  }, [queryString])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function openEdit(u) {
    setEditingUser(u)
    setIsEditOpen(true)
  }

  function openDelete(u) {
    setDeletingUser(u)
    setIsDeleteOpen(true)
  }

  async function addUser(payload) {
    setMutating(true)
    setError(null)
    try {
      await axiosInstance.post('/api/users', payload)
      setIsAddOpen(false)
      await fetchUsers()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setMutating(false)
    }
  }

  async function updateUser(payload) {
    if (!editingUser?.id) {
      setError('Cannot update: missing user id.')
      return
    }
    setMutating(true)
    setError(null)
    try {
      await axiosInstance.put(`/api/users/${editingUser.id}`, payload)
      setIsEditOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setMutating(false)
    }
  }

  async function softDeleteUser() {
    if (!deletingUser?.id) {
      setError('Cannot delete: missing user id.')
      return
    }
    setMutating(true)
    setError(null)
    try {
      await axiosInstance.delete(`/api/users/${deletingUser.id}`)
      setIsDeleteOpen(false)
      setDeletingUser(null)
      await fetchUsers()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setMutating(false)
    }
  }

  return (
    <div className="page users-page">
      <div className="page-title">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          Add User
        </button>
      </div>

      <div className="card">
        <div className="row users-controls">
          <input
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search by name or email…"
            className="users-search"
          />

          <select
            value={role}
            onChange={(e) => {
              setPage(1)
              setRole(e.target.value)
            }}
          >
            <option value="">All roles</option>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="user">user</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value)
            }}
          >
            <option value="">All status</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="deleted">deleted</option>
          </select>

          <button className="btn btn-ghost" onClick={fetchUsers}>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="error users-error" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? <Loader label="Loading users..." /> : null}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th className="col-role">Role</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="muted">
                    No users found.
                  </td>
                </tr>
              ) : null}

              {users.map((u) => (
                <tr key={u.id ?? `${u.email}-${u.name}`}>
                  <td className="muted">{u.id ?? '—'}</td>
                  <td>{u.name ?? '—'}</td>
                  <td className="muted">{u.email ?? '—'}</td>
                  <td>{u.role ?? '—'}</td>
                  <td>{u.status ?? '—'}</td>
                  <td>
                    <div className="row">
                      <button className="btn" onClick={() => openEdit(u)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => openDelete(u)}
                      >
                        Delete
                      </button>
                    </div>
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

      <Modal
        title="Add User"
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      >
        <UserForm
          initial={null}
          submitting={mutating}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={addUser}
        />
      </Modal>

      <Modal
        title="Edit User"
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setEditingUser(null)
        }}
      >
        <UserForm
          initial={editingUser}
          submitting={mutating}
          onCancel={() => {
            setIsEditOpen(false)
            setEditingUser(null)
          }}
          onSubmit={updateUser}
        />
      </Modal>

      <Modal
        title="Confirm soft delete"
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingUser(null)
        }}
        footer={
          <div className="row">
            <button
              className="btn btn-danger"
              onClick={softDeleteUser}
              disabled={mutating}
              type="button"
            >
              {mutating ? 'Deleting…' : 'Delete'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setIsDeleteOpen(false)
                setDeletingUser(null)
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        }
      >
        <p>
          This will <b>soft delete</b> the user{' '}
          <b>{deletingUser?.email || deletingUser?.name || '—'}</b>.
        </p>
      </Modal>
    </div>
  )
}

