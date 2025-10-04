import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  "Multi-source oracle consensus with signed attestations",
  "Formal verification of core payout contracts",
  "On-chain circuit breakers for systemic risk events",
  "Multi-party audits and active bug bounty program",
  "ZK proofs for privacy-preserving claims verification",
  "Time-locked governance with emergency multisig override",
];

export const Security = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        style={{ scale, opacity }}
        className="max-w-5xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-sm tracking-[0.3em] uppercase font-light">
            Security & Trust
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold mb-12"
        >
          Battle-Tested Infrastructure
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed"
        >
          Multi-layered security architecture with formal verification, redundant
          oracle systems, and transparent on-chain governance.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="border border-foreground p-8 text-left hover:bg-foreground hover:text-background transition-colors group"
            >
              <div className="text-4xl font-bold mb-4 opacity-20 group-hover:opacity-30">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-lg">{feature}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-12 pt-12 border-t border-foreground"
        >
          {[
            { label: "Audited By", value: "Trail of Bits + OpenZeppelin" },
            { label: "Bug Bounty", value: "$500K Pool" },
            { label: "Uptime", value: "99.99%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-sm uppercase tracking-wider mb-2 opacity-70">
                {stat.label}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
