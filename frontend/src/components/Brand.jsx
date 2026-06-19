import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-bold ${light ? 'text-white' : 'text-ink'}`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-white"><Activity size={22} /></span>
      <span className="font-[Manrope] text-lg">Outbreak<span className="text-teal-500">AI</span></span>
    </Link>
  )
}

