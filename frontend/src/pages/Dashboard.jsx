import { Activity, AlertTriangle, MapPin, TestTubes } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/client'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'

const fallbackTrend = [{ date: 'Mon', probability: 24 }, { date: 'Tue', probability: 31 }, { date: 'Wed', probability: 28 }, { date: 'Thu', probability: 43 }, { date: 'Fri', probability: 52 }, { date: 'Sat', probability: 47 }, { date: 'Sun', probability: 61 }]

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_predictions: 0, high_risk_cases: 0, average_probability: 0, locations_monitored: 0 })
  const [trend, setTrend] = useState(fallbackTrend)
  useEffect(() => { Promise.all([api.get('/dashboard'), api.get('/analytics')]).then(([dashboard, analytics]) => { setSummary(dashboard.data); if (analytics.data.daily_trend.length) setTrend(analytics.data.daily_trend) }).catch(() => {}) }, [])
  return <div><PageHeader eyebrow="Situation room" title="Health intelligence dashboard" description="A real-time overview of stored predictions and emerging risk signals." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total predictions" value={summary.total_predictions} helper="All recorded assessments" icon={TestTubes} /><MetricCard label="High-risk cases" value={summary.high_risk_cases} helper="Require prompt follow-up" icon={AlertTriangle} tone="red" /><MetricCard label="Average probability" value={`${summary.average_probability}%`} helper="Across stored assessments" icon={Activity} tone="blue" /><MetricCard label="Locations monitored" value={summary.locations_monitored} helper="Distinct reported areas" icon={MapPin} tone="amber" /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]"><div className="card p-5 md:p-6"><div className="mb-6"><h2 className="text-lg font-bold">Outbreak probability trend</h2><p className="mt-1 text-sm text-slate-500">Daily average from prediction history</p></div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis domain={[0,100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="probability" stroke="#0d9488" strokeWidth={3} fill="url(#trendFill)" /></AreaChart></ResponsiveContainer></div></div><div className="card p-6"><h2 className="text-lg font-bold">Response checklist</h2><div className="mt-5 space-y-5">{['Review high-risk predictions', 'Check geographic clustering', 'Validate unusual lab signals', 'Escalate through health channels'].map((item, i) => <div key={item} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">{i+1}</span><p className="pt-1 text-sm text-slate-600">{item}</p></div>)}</div></div></div>
  </div>
}

