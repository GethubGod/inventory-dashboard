"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Activity, CreditCard, LayoutDashboard, Package, Settings, Users, ArrowUpRight } from "lucide-react";

export const Screen5WebDashboard = memo(function Screen5WebDashboard() {
  return (
    <div className="w-full h-full bg-[#f8f9fa] flex font-sans overflow-hidden border border-black/5">
      {/* Sidebar */}
      <div className="w-[180px] h-full bg-white border-r border-black/5 flex flex-col p-4 shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="h-6 w-6 rounded-md bg-teal-500 text-white flex items-center justify-center font-bold text-xs" />
          <span className="font-bold text-sm tracking-tight">babytuna</span>
        </div>
        
        <nav className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={Package} label="Inventory" />
          <NavItem icon={Activity} label="Forecasting" />
          <NavItem icon={CreditCard} label="Orders" />
          <NavItem icon={Users} label="Team" />
        </nav>
        
        <div className="mt-auto">
          <NavItem icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col h-full bg-[#fafafa]">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500">Welcome back, Alex. Your inventory health is 96%.</p>
          </div>
          <div className="flex gap-3">
            <button className="h-9 px-4 rounded-md border border-black/10 text-sm font-medium bg-white hover:bg-zinc-50 shadow-sm transition">Export</button>
            <button className="h-9 px-4 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition shadow-sm">New Order</button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard title="Total Inventory Value" value="$12,450" trend="+4.5%" positive={false} />
          <MetricCard title="Predicted Spend (7d)" value="$3,100" trend="-12%" positive={true} />
          <MetricCard title="Automation Accuracy" value="99.2%" trend="+0.8%" positive={true} />
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 bg-white rounded-xl border border-black/5 shadow-sm p-6 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-sm text-zinc-800">Usage vs Forecast</h3>
            <div className="flex gap-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-400"/> Actual</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-300"/> Forecast</span>
            </div>
          </div>
          
          <div className="flex-1 w-full flex items-end px-2 pb-6 relative">
            {/* Minimal SVG line chart draw animation */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <motion.path
                d="M 0,80 Q 20,70 30,50 T 60,30 T 100,10"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 0,75 Q 20,60 30,55 T 60,35 T 100,20"
                fill="none"
                stroke="#e4e4e7"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                viewport={{ once: true }}
              />
            </svg>
          </div>
          
          <div className="w-full flex justify-between text-[10px] text-zinc-400 uppercase tracking-widest px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Animated Insight Callout overlapping chart */}
          <motion.div 
            className="absolute top-1/2 right-12 bg-white p-3 rounded-lg shadow-lg border border-teal-500/20 max-w-[160px]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-teal-600 mb-1">
              <Activity className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Insight</span>
            </div>
            <p className="text-xs text-zinc-600 leading-tight">Trending 12% under budget for dairy this week.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${active ? 'bg-zinc-100 text-teal-600 font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}>
      <Icon className={`h-4 w-4 ${active ? 'text-teal-600' : 'text-zinc-400'}`} />
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />}
    </div>
  );
}

function MetricCard({ title, value, trend, positive }: { title: string, value: string, trend: string, positive: boolean }) {
  return (
    <motion.div 
      className="bg-white p-5 rounded-xl border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <h4 className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">{title}</h4>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <ArrowUpRight className="h-3 w-3 mr-0.5" />
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
