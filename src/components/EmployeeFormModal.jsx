import { useState, useEffect } from 'react'

const empty = {
  employee_id: '',
  full_name: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  salary: '',
  joining_date: '',
  address: '',
  role: 'employee',
}

export default function EmployeeFormModal({ open, onClose, onSave, initial, saving }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty)
  }, [initial, open])

  if (!open) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  const isEdit = Boolean(initial?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
      <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in border border-line">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">
            {isEdit ? 'Edit employee' : 'Add employee'}
          </h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-sm">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {!isEdit && (
            <div className="bg-amber/10 border border-amber/30 text-amber-900 text-xs rounded-lg px-3 py-2">
              New employees also need a login account created in Supabase Auth
              (or via the invite flow) with the same email, so they can sign in.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="EMP Id">
              <input
                value={form.employee_id}
                onChange={(e) => update('employee_id', e.target.value)}
                placeholder={isEdit ? '' : 'Auto-generated if left blank'}
                className="input"
              />
            </Field>
            <Field label="Full name" required>
              <input
                required
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Email Id" required>
              <input
                type="email"
                required
                disabled={isEdit}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input disabled:opacity-50"
              />
            </Field>
            <Field label="Phone no.">
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Department">
              <input
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Position">
              <input
                value={form.designation}
                onChange={(e) => update('designation', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Salary (₹)">
              <input
                type="number"
                value={form.salary}
                onChange={(e) => update('salary', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Joining date">
              <input
                type="date"
                value={form.joining_date}
                onChange={(e) => update('joining_date', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className="input"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>

          <Field label="Address">
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="input resize-none"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-line hover:bg-canvas transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-violet text-white hover:bg-violet-dark transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-line);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: 0.15s;
        }
        .input:focus {
          border-color: var(--color-violet);
          box-shadow: 0 0 0 3px rgba(124,92,250,0.15);
        }
      `}</style>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink/60 mb-1">
        {label} {required && <span className="text-rose">*</span>}
      </span>
      {children}
    </label>
  )
}
