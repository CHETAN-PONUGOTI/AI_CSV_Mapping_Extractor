import "./globals.css";
import { Inter } from "next/font/google";
import { 
  LayoutDashboard, Users, UserPlus, MessageSquare, 
  Settings, Phone, Database, Link 
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f8fafc] flex h-screen overflow-hidden text-slate-800`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">↗</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight">GrowEasy</span>
          </div>
          
          <div className="px-4 pb-4">
            <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center font-bold">VK</div>
                <div className="text-sm">
                  <p className="font-semibold leading-none">VK Test</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Owner</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3 px-2">MAIN</p>
              <ul className="space-y-1 text-sm font-medium text-slate-600">
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><LayoutDashboard size={18} /> Dashboard</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><UserPlus size={18} /> Generate Leads</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg bg-teal-50/50 text-teal-700 cursor-pointer"><Database size={18} /> Manage Leads</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><MessageSquare size={18} /> Engage Leads</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3 px-2">CONTROL CENTER</p>
              <ul className="space-y-1 text-sm font-medium text-slate-600">
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><Users size={18} /> Team Members</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><Link size={18} /> Lead Sources</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><Phone size={18} /> Tele Calling</li>
                <li className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"><Settings size={18} /> API Center</li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </body>
    </html>
  );
}