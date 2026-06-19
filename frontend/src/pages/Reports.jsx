import { ClipboardList, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const load = useCallback(() => { setLoading(true); api.get('/reports').then(({ data }) => setReports(data.reports)).catch(() => {}).finally(() => setLoading(false)) }, [])
  useEffect(() => { load() }, [load])
  return <div><PageHeader eyebrow="Historical record" title="Prediction reports" description="Review anonymized prediction history stored in the local SQLite database." action={<button className="btn-secondary !py-2" onClick={load}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh</button>} />
    <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{['ID','Date','Location','Age / Gender','Symptoms','Disease category','Risk','Probability'].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{reports.map((report) => <tr key={report.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold">#{report.id}</td><td className="px-5 py-4 text-slate-500">{new Date(report.created_at).toLocaleDateString()}</td><td className="px-5 py-4">{report.location}</td><td className="px-5 py-4">{report.age} / {report.gender}</td><td className="max-w-48 truncate px-5 py-4 text-slate-500">{report.symptoms}</td><td className="px-5 py-4">{report.disease_category}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${report.risk_level === 'High' ? 'bg-red-50 text-red-700' : report.risk_level === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{report.risk_level}</span></td><td className="px-5 py-4 font-bold">{report.outbreak_probability}%</td></tr>)}</tbody></table></div>{!loading && !reports.length && <div className="grid place-items-center px-5 py-16 text-center"><ClipboardList className="text-slate-300" size={42} /><h3 className="mt-4 font-bold">No reports yet</h3><p className="mt-1 text-sm text-slate-500">Complete a prediction to create the first report.</p></div>}</div>
  </div>
}

