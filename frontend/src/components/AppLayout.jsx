import { Activity, Bot, ChartNoAxesCombined, ClipboardList, LayoutDashboard, Menu, ShieldCheck, Stethoscope, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Brand from './Brand'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/predict', label: 'New prediction', icon: Stethoscope },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { to: '/chat', label: 'Consultation', icon: Bot },
  { to: '/reports', label: 'Reports', icon: ClipboardList },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
]

function Sidebar({ close }) {
  return (
    <aside className="flex h-full w-64 flex-col bg-[#0b2b2e] p-5 text-slate-300">
      <div className="mb-9 flex items-center justify-between"><Brand light /><button className="lg:hidden" onClick={close}><X /></button></div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-teal-500 text-white' : 'hover:bg-white/10 hover:text-white'}`}>
            <Icon size={19} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-white/10 p-4 text-xs leading-5"><Activity className="mb-2 text-teal-400" size={20} />Decision support for public-health monitoring. Not a diagnostic device.</div>
    </aside>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block"><Sidebar /></div>
      {open && <div className="fixed inset-0 z-50 flex lg:hidden"><div className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} /><div className="relative"><Sidebar close={() => setOpen(false)} /></div></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
          <p className="hidden text-sm text-slate-500 sm:block">Laboratory intelligence platform</p>
          <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="text-sm font-semibold">System online</span><span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 font-bold text-teal-700">AD</span></div>
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

