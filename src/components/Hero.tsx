import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="max-w-6xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-sm tracking-[0.3em] uppercase font-light">
            Decentralized Insurance Protocol
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-7xl md:text-9xl font-bold mb-8 leading-none tracking-tight"
        >
          Web3 Mutual
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-muted-foreground font-light leading-relaxed"
        >
          A permissionless mutual-insurance DAO where participants pool capital to
          underwrite narrowly scoped risks. Coverage is fractional, parametric, and
          governed on-chain with automatic payouts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform"
          >
            Launch App
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform"
          >
            Read Docs
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 grid grid-cols-3 gap-12 max-w-3xl mx-auto"
        >
          {[
            { value: "$10M+", label: "Total Value Locked" },
            { value: "2,500+", label: "Active Policies" },
            { value: "99.8%", label: "Claims Success Rate" },
          ].map((stat, i) => (
            <div key={i} className="border-t border-foreground pt-4">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-foreground rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-foreground rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};
