'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function TestimonialsSection({ testimonials, feedbacks }) {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/50 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-background hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <motion.div
                        className="relative h-12 w-12 flex-shrink-0"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.image}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </motion.div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <motion.span
                          className="text-3xl text-primary absolute -top-4 -left-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          &quot;
                        </motion.span>
                        {testimonial.quote}
                        <motion.span
                          className="text-3xl text-primary absolute -bottom-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          &quot;
                        </motion.span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {feedbacks.map((feedback, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + testimonials.length) * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-background hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <motion.div
                        className="relative h-12 w-12 flex-shrink-0"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Image
                          width={40}
                          height={40}
                          src={feedback?.user?.imageUrl}
                          alt={feedback?.user?.imageUrl}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </motion.div>
                      <div>
                        <p className="font-semibold">{feedback?.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {feedback?.user?.role || "Product User"}
                        </p>
                        <p className="text-sm text-primary">
                          {feedback?.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <motion.span
                          className="text-3xl text-primary absolute -top-4 -left-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          &quot;
                        </motion.span>
                        {feedback.comment}
                        <motion.span
                          className="text-3xl text-primary absolute -bottom-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          &quot;
                        </motion.span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 