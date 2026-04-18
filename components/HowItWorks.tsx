"use client";

import { motion } from "motion/react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function HowItWorksSection() {
  return (
    <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            How it <span className="text-primary">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            Create stunning AI art in three simple steps. No complex prompts or
            settings required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative flex flex-col items-center text-center p-8 rounded-3xl border transition-colors duration-300 ${
                  step.featured
                    ? "bg-primary/5 border-primary shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]"
                    : "bg-card border-border shadow-sm hover:border-primary/50"
                }`}
              >
                {step.featured && (
                  <div className="absolute -top-3">
                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                      Magic happens here
                    </span>
                  </div>
                )}

                <div
                  className={`mb-6 flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm ${
                    step.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <Icon size={32} />
                </div>

                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
