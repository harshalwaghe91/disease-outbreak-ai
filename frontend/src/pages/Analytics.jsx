import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/client'
import PageHeader from '../components/PageHeader'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#0d9488', '#3b82f6']
export default function Analytics() {
  const [data, setData] = useState({ risk_distribution: [], disease_distribution: [] })
  useEffect(() => { api.get('/analytics').then(({ data }) => setData(data)).catch(() => {}) }, [])
  const empty = !data.risk_distribution.length
  return <div><PageHeader eyebrow="Epidemiological view" title="Analytics" description="Explore the categories and risk levels represented in stored predictions." />
    {empty && <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">No prediction history yet. Charts will populate after the first assessment.</div>}
    <div className="grid gap-6 xl:grid-cols-2"><section className="card p-6"><h2 className="text-lg font-bold">Risk distribution</h2><p className="mt-1 text-sm text-slate-500">Cases grouped by predicted risk</p><div className="h-80"><ResponsiveContainer><PieChart><Pie data={data.risk_distribution} dataKey="value" nameKey="name" innerRadius={68} outerRadius={105} paddingAngle={4}>{data.risk_distribution.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></section>
      <section className="card p-6"><h2 className="text-lg font-bold">Disease categories</h2><p className="mt-1 text-sm text-slate-500">Frequency of predicted illness groups</p><div className="h-80"><ResponsiveContainer><BarChart data={data.disease_distribution} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={115} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cases" fill="#0d9488" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer></div></section></div>
  </div>
}

