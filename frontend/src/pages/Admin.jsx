import { Activity, CheckCircle2, Database, Server, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/client'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'

export default function Admin() {
  const [online, setOnline] = useState(false)
  const [summary, setSummary] = useState({ total_predictions: 0, locations_monitored: 0 })
  useEffect(() => { api.get('/health').then(() => setOnline(true)).catch(() => setOnline(false)); api.get('/dashboard').then(({ data }) => setSummary(data)).catch(() => {}) }, [])
  return <div><PageHeader eyebrow="System management" title="Admin dashboard" description="Monitor platform health, data volume, and safety configuration." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="API service" value={online ? 'Online' : 'Offline'} helper="FastAPI health endpoint" icon={Server} /><MetricCard label="Stored records" value={summary.total_predictions} helper="SQLite prediction rows" icon={Database} tone="blue" /><MetricCard label="Coverage areas" value={summary.locations_monitored} helper="Distinct locations" icon={Activity} tone="amber" /><MetricCard label="Safety rules" value="Active" helper="Emergency terms enabled" icon={ShieldCheck} tone="teal" /></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="card p-6"><h2 className="text-lg font-bold">Service status</h2><div className="mt-5 space-y-3">{[['Prediction model','Loaded on first request'],['Database','SQLite persistence enabled'],['Chatbot','Rule-based safety flow'],['CORS','Environment-controlled origin']].map(([name,status]) => <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={18} /><span className="font-semibold">{name}</span></div><span className="text-xs text-slate-500">{status}</span></div>)}</div></section><section className="card p-6"><h2 className="text-lg font-bold">Responsible-use controls</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600"><li>• No names, contact details, or patient identifiers are collected.</li><li>• Prediction output includes a clinical-use disclaimer.</li><li>• Chat responses never claim to provide a final diagnosis.</li><li>• Emergency symptoms trigger urgent professional-care guidance.</li><li>• This demonstration requires human review before any action.</li></ul></section></div>
  </div>
}

