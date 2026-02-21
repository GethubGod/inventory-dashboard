"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Truck, Check, ChevronRight } from "lucide-react";
import { generateStaggerConfig } from "@/lib/motion";

export const Screen3Fulfillment = memo(function Screen3Fulfillment() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white p-6 pt-12 flex flex-col relative">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-medium flex items-center gap-2">
            <Truck className="h-5 w-5 text-lime-400" /> Auto-Routing
          </h3>
          <p className="text-sm text-zinc-500">Grouped by Supplier</p>
        </div>
      </div>

      <motion.div
        className="flex-1 space-y-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={generateStaggerConfig(0.2)}
      >
        <SupplierCard
          name="Sysco West"
          items={4}
          total="$342.50"
          delivery="Tomorrow, 6 AM"
          active
        />
        <SupplierCard
          name="Local Produce Co."
          items={12}
          total="$185.00"
          delivery="Tomorrow, 8 AM"
        />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
        className="absolute bottom-6 left-6 right-6"
      >
        <button className="w-full bg-lime-500 text-black font-semibold rounded-xl py-4 shadow-[0_0_40px_rgba(132,204,22,0.2)] flex justify-center items-center gap-2 group">
          Submit 2 Orders
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
});

function SupplierCard({ name, items, total, delivery, active = false }: any) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      }}
      className={`p-4 rounded-xl border ${active ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"} relative overflow-hidden`}
    >
      {active && (
        <div className="absolute top-0 left-0 w-1 h-full bg-lime-400" />
      )}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-sm text-zinc-400">{items} items • {total}</p>
        </div>
        <div className="h-6 w-6 rounded-full bg-lime-400 text-black flex items-center justify-center">
          <Check className="h-4 w-4" />
        </div>
      </div>
      <div className="text-xs text-lime-400 bg-lime-400/10 inline-block px-2 py-1 rounded font-mono">
        {delivery}
      </div>
    </motion.div>
  );
}
