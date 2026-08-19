import { useAuth } from '../context/AuthContext'
import Shell from '../components/Shell'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
      <span className="text-sm text-ink/50">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

export default function EmployeeDashboard() {
  const { profile } = useAuth()

  return (
    <Shell title="My Profile">
      <div className="max-w-xl animate-in">
        <div className="bg-surface border border-line rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-violet/10 text-violet font-display font-semibold flex items-center justify-center text-lg">
            {profile?.full_name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{profile?.full_name}</h2>
            <p className="text-sm text-ink/50">
              {profile?.designation || 'Employee'}
              {profile?.employee_id ? ` · ${profile.employee_id}` : ''}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-6">
          <Row label="Employee ID" value={profile?.employee_id} />
          <Row label="Email" value={profile?.email} />
          <Row label="Phone" value={profile?.phone} />
          <Row label="Department" value={profile?.department} />
          <Row label="Designation" value={profile?.designation} />
          <Row
            label="Joining date"
            value={
              profile?.joining_date &&
              new Date(profile.joining_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            }
          />
          <Row label="Address" value={profile?.address} />
        </div>

        <p className="text-xs text-ink/40 mt-4">
          Need to update your details? Contact your admin/HR team.
        </p>
      </div>
    </Shell>
  )
}
