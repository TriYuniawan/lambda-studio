"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    price: 0,
    description: "Perfect to try out the magic.",
    features: [
      "3 Generations total",
      "Standard speed",
      "Community support",
      "Watermarked outputs",
    ],
    notIncluded: ["High-resolution downloads", "Commercial usage rights"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: 12,
    description: "For creators who need more power.",
    features: [
      "100 Generations per month",
      "Fast processing",
      "High-resolution downloads",
      "Priority support",
      "No watermarks",
    ],
    notIncluded: ["Commercial usage rights"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Studio",
    price: 27,
    description: "For professionals and teams.",
    features: [
      "300 Generations per Month",
      "Fastest processing",
      "4K resolution downloads",
      "Commercial usage rights",
      "API Access",
      "24/7 Dedicated support",
    ],
    notIncluded: [],
    cta: "Upgrade to Studio",
    popular: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-background"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Simple, transparent <span className="text-primary">pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            Choose the plan that best fits your creative needs. Save 20% with an
            annual subscription.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-16 space-x-4"
        >
          <span
            className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          >
            <span className="sr-only">Toggle Annual</span>
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-primary transition-transform ${isAnnual ? "translate-x-8" : "translate-x-1"}`}
            />
          </button>
          <span
            className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annually{" "}
            <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">
              Save 20%
            </span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => {
            const priceToDisplay =
              plan.price === 0
                ? 0
                : isAnnual
                  ? (plan.price * 0.8).toFixed(2).replace(/\.00$/, "")
                  : plan.price;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-card border-primary shadow-[0_0_40px_-10px_rgba(var(--primary),0.2)] scale-100 md:scale-105 z-10"
                    : "bg-card/50 border-border shadow-sm hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${priceToDisplay}
                    </span>
                    <span className="text-muted-foreground ml-2 font-medium">
                      / month
                    </span>
                  </div>
                  {isAnnual && plan.price > 0 ? (
                    <p className="text-sm text-primary mt-2 font-medium">
                      Billed $
                      {(plan.price * 0.8 * 12).toFixed(2).replace(/\.00$/, "")}{" "}
                      yearly
                    </p>
                  ) : (
                    <p className="text-sm text-transparent mt-2 pointer-events-none select-none">
                      Spacer
                    </p>
                  )}
                </div>

                <Button
                  className={`w-full mb-8 rounded-full h-12 text-base font-medium cursor-pointer ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  variant={plan.popular ? "default" : "secondary"}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-3" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-start opacity-50">
                      <XIcon className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
