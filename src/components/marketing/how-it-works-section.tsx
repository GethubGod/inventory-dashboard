"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { generateStaggerConfig, transitionVariations } from "@/lib/motion";

const steps = [
  {
    num: "01",
    title: "Connect your POS & Suppliers",
    desc: "Link Square, Toast, or Clover in one click. Upload your current vendor guides and past invoices. We handle the digitizing."
  },
  {
    num: "02",
    title: "Speak your inventory",
    desc: "Walk the walk-in and just talk to the app. 'I have 2 cases of roma tomatoes and half a box of lemons.' We log it instantly."
  },
  {
    num: "03",
    title: "Review automated orders",
    desc: "Based on what you have and what you're predicted to sell, we generate perfect draft carts. Review, edit, and hit approve."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white text-zinc-900 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={generateStaggerConfig(0.15)}
          >
            <motion.h2 variants={transitionVariations.fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
              From chaos to control in <span className="text-teal-600">three steps.</span>
            </motion.h2>
            
            <div className="space-y-12 mt-12">
              {steps.map((step, idx) => (
                <motion.div key={idx} variants={transitionVariations.fadeUp} className="flex gap-6 relative">
                  {/* Connection Line */}
                  {idx !== steps.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-[-3rem] w-px bg-zinc-200" />
                  )}
                  
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center font-bold font-mono text-zinc-400 border border-zinc-200 z-10">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-zinc-600 leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/5] md:aspect-square bg-zinc-50 rounded-3xl border border-black/5 overflow-hidden shadow-2xl relative flex items-center justify-center">
              {/* Abstract Representation of the System */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-lime-500/10 pointer-events-none" />
              
              <div className="w-[80%] max-w-sm space-y-4">
                <ProcessCard delay={0} icon={CheckCircle2} title="Square Connected" status="Active Sync" />
                <ProcessCard delay={0.2} icon={CheckCircle2} title="Sysco Catalog" status="Imported 2,042 items" />
                <ProcessCard delay={0.4} icon={CheckCircle2} title="Staff Roster" status="7 Team Members" />
                
                <div className="mt-8 pt-8 border-t border-black/10 flex items-center justify-between">
                  <div className="w-1/2 h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-teal-500 rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-teal-600">Setup Complete</span>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 -right-20 -top-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute -z-10 -left-20 -bottom-20 w-64 h-64 bg-lime-400/20 rounded-full blur-3xl opacity-50" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ProcessCard({ delay, icon: Icon, title, status }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex items-center gap-4"
    >
      <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-zinc-900">{title}</p>
        <p className="text-sm text-zinc-500">{status}</p>
      </div>
    </motion.div>
  );
}
