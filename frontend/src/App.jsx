import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const AppLayout = lazy(() => import('./components/AppLayout'))
const Admin = lazy(() => import('./pages/Admin'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Chatbot = lazy(() => import('./pages/Chatbot'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Landing = lazy(() => import('./pages/Landing'))
const Prediction = lazy(() => import('./pages/Prediction'))
const Reports = lazy(() => import('./pages/Reports'))

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-teal-700">Loading OutbreakAI…</div>}><Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="predict" element={<Prediction />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="chat" element={<Chatbot />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense>
  )
}
