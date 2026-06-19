export default function MetricCard({ label, value, helper, icon: Icon, tone = 'teal' }) {
  const tones = { teal: 'bg-teal-50 text-teal-700', red: 'bg-red-50 text-red-600', blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600' }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-ink">{value}</p></div>
        <span className={`rounded-xl p-3 ${tones[tone]}`}><Icon size={21} /></span>
      </div>
      {helper && <p className="mt-3 text-xs text-slate-500">{helper}</p>}
    </div>
  )
}

