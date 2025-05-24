'use client';

import { motion } from "framer-motion";
import { howItWorks } from "@/data/howItWorks";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  hover: {
    rotate: 360,
    scale: 1.1,
    transition: {
      duration: 0.5
    }
  }
};

export default function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Four simple steps to accelerate your career growth
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {howItWorks.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-colors"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                {item.icon}
              </motion.div>
              <h3 className="font-semibold text-xl">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 