"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIAL_COLUMNS } from "@/lib/constants";
import { motion } from "motion/react";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-background relative w-full overflow-hidden"
    >
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight"
            >
              Loved by the <span className="text-primary">Community</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              See what our users are saying about how Lambda Studio transforms their
              creative process.
            </motion.p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {TESTIMONIAL_COLUMNS.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-4">
                {column.map(({ name, role, text, image }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * columnIndex + 0.1 * index }}
                  >
                    <Card className="break-inside-avoid bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                      <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                        <Avatar className="size-10">
                          <AvatarImage alt={name} src={image} loading="lazy" />
                          <AvatarFallback>
                            {name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className="font-semibold text-foreground">
                            {name}
                          </h3>
                          <span className="text-muted-foreground block text-sm">
                            {role}
                          </span>

                          <blockquote className="mt-4">
                            <p className="text-foreground leading-relaxed">
                              {text}
                            </p>
                          </blockquote>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
