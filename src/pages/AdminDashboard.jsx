import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import Shell from '../components/Shell'
import EmployeeFormModal from '../components/EmployeeFormModal'

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function fetchEmployees() {
    setLoading(true)
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setEmployees(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return employees.filter(
      (e) =>
        e.full_name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.department?.toLowerCase().includes(q) ||
        e.employee_id?.toLowerCase().includes(q)
    )
  }, [employees, search])

  async function handleSave(form) {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      salary: form.salary ? Number(form.salary) : null,
      joining_date: form.joining_date || null,
    }
    // leave employee_id out on insert if blank, so the DB auto-generates EMP0001, EMP0002...
    if (!payload.employee_id) delete payload.employee_id

    let res
    if (editing?.id) {
      res = await supabase.from('employees').update(payload).eq('id', editing.id)
    } else {
      res = await supabase.from('employees').insert(payload)
    }

    setSaving(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    setModalOpen(false)
    setEditing(null)
    fetchEmployees()
  }

  async function handleDelete(id) {
    if (!confirm('Remove this employee record?')) return
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) setError(error.message)
    else fetchEmployees()
  }

  return (
    <Shell title="Employees">
      <div className="flex items-center justify-between mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, department…"
          className="w-full max-w-xs rounded-lg border border-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet bg-surface"
        />
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="shrink-0 bg-violet hover:bg-violet-dark text-white text-sm font-medium rounded-lg px-4 py-2 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add employee
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm bg-rose/10 text-rose border border-rose/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-surface border border-line rounded-2xl overflow-hidden animate-in">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/40 border-b border-line">
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Employee</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Designation</th>
              <th className="px-5 py-3 font-medium">Salary</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-ink/40">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0 hover:bg-canvas/60 transition">
                  <td className="px-5 py-3 text-ink/50 font-mono text-xs">{e.employee_id || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet/10 text-violet text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials(e.full_name)}
                      </div>
                      <div>
                        <p className="font-medium">{e.full_name}</p>
                        <p className="text-xs text-ink/40">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{e.department || '—'}</td>
                  <td className="px-5 py-3 text-ink/70">{e.designation || '—'}</td>
                  <td className="px-5 py-3 text-ink/70">
                    {e.salary ? `₹${Number(e.salary).toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        e.role === 'admin'
                          ? 'bg-amber/15 text-amber-700'
                          : 'bg-teal/10 text-teal'
                      }`}
                    >
                      {e.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      onClick={() => {
                        setEditing(e)
                        setModalOpen(true)
                      }}
                      className="text-violet hover:underline text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-rose hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        initial={editing}
        saving={saving}
      />
    </Shell>
  )
}
