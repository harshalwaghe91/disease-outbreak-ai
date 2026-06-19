import { AlertTriangle, CheckCircle2, LoaderCircle, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import api, { getErrorMessage } from '../api/client'
import PageHeader from '../components/PageHeader'

const initialForm = { age: 35, gender: 'Female', location: 'Urban North', symptoms: 'fever fatigue body ache', wbc_count: 8.5, rbc_count: 4.7, platelet_count: 220, hemoglobin: 13.5, crp: 12, esr: 20, temperature: 38.2, oxygen_saturation: 97, blood_sugar: 110 }
const numericFields = [
  ['age', 'Age', 'years'], ['wbc_count', 'WBC Count', '10³/µL'], ['rbc_count', 'RBC Count', 'million/µL'],
  ['platelet_count', 'Platelet Count', '10³/µL'], ['hemoglobin', 'Hemoglobin', 'g/dL'], ['crp', 'CRP', 'mg/L'],
  ['esr', 'ESR', 'mm/hr'], ['temperature', 'Temperature', '°C'], ['oxygen_saturation', 'Oxygen Saturation', '%'], ['blood_sugar', 'Blood Sugar', 'mg/dL'],
]

export default function Prediction() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.type === 'number' ? Number(target.value) : target.value }))
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); setResult(null); try { const { data } = await api.post('/predict', form); setResult(data) } catch (err) { setError(getErrorMessage(err)) } finally { setLoading(false) } }
  const riskStyle = { Low: 'bg-emerald-50 text-emerald-700', Medium: 'bg-amber-50 text-amber-700', High: 'bg-red-50 text-red-700' }
  return (
    <div><PageHeader eyebrow="Clinical signal" title="New outbreak prediction" description="Enter anonymized patient demographics, symptoms, and laboratory results. Every field is required." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="card p-5 md:p-7"><h2 className="text-lg font-bold">Patient & laboratory data</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numericFields.map(([name, label, unit]) => <label key={name}><span className="label">{label} <span className="font-normal text-slate-400">({unit})</span></span><input className="field" type="number" step="any" name={name} value={form[name]} onChange={update} required /></label>)}
          <label><span className="label">Gender</span><select className="field" name="gender" value={form.gender} onChange={update}><option>Female</option><option>Male</option><option>Other</option></select></label>
          <label className="sm:col-span-2"><span className="label">Location</span><input className="field" name="location" value={form.location} onChange={update} required /></label>
          <label className="sm:col-span-2 lg:col-span-3"><span className="label">Symptoms</span><textarea className="field min-h-24" name="symptoms" value={form.symptoms} onChange={update} placeholder="Describe current symptoms" required /></label>
        </div><div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />}{loading ? 'Analyzing…' : 'Generate prediction'}</button><button type="button" className="btn-secondary" onClick={() => { setForm(initialForm); setResult(null); setError('') }}><RotateCcw size={17} /> Reset</button></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</form>
        <aside className="space-y-5">{result ? <div className="card overflow-hidden"><div className="bg-[#0b2b2e] p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-teal-300">Prediction complete</p><div className="mt-4 flex items-center justify-between"><div><p className="text-sm text-slate-300">Outbreak probability</p><p className="mt-1 text-4xl font-bold">{result.outbreak_probability}%</p></div><CheckCircle2 className="text-teal-400" size={34} /></div></div><div className="space-y-5 p-6"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk level</p><span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold ${riskStyle[result.risk_level]}`}>{result.risk_level}</span></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Likely category</p><p className="mt-1 font-bold">{result.disease_category}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended action</p><p className="mt-1 text-sm leading-6 text-slate-600">{result.recommendation}</p></div><div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800"><AlertTriangle className="mb-1" size={16} />{result.disclaimer}</div></div></div> : <div className="card p-6"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700"><Sparkles /></div><h3 className="mt-5 text-lg font-bold">Your result will appear here</h3><p className="mt-2 text-sm leading-6 text-slate-500">The model will return a risk level, disease category, outbreak probability, and prevention recommendation.</p></div>}<div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-800">Use de-identified demonstration data only. This academic prototype is not validated for clinical use.</div></aside>
      </div>
    </div>
  )
}

