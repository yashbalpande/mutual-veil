import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Pool Capital",
    description:
      "Contributors deposit stablecoins into specialized risk pools. Capital is segmented by risk type and geography.",
  },
  {
    number: "02",
    title: "Purchase Coverage",
    description:
      "Users buy fractional coverage through ERC-1155 policy NFTs. Premiums are calculated dynamically based on real-time risk metrics.",
  },
  {
    number: "03",
    title: "Oracle Monitoring",
    description:
      "Multi-source parametric oracles continuously monitor trigger conditions via satellite data, weather APIs, and on-chain telemetry.",
  },
  {
    number: "04",
    title: "Automatic Payout",
    description:
      "When oracle thresholds are met, smart contracts execute immediate payouts. No manual claims processing required.",
  },
];

export const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={ref} className="py-32 px-6 bg-foreground text-background">
      <motion.div style={{ scale }} className="max-w-7xl mx-auto">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-sm tracking-[0.3em] uppercase font-light opacity-70">
              How It Works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold max-w-3xl"
          >
            Four Steps to Coverage
          </motion.h2>
        </div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="text-[12rem] md:text-[16rem] font-bold leading-none opacity-10">
                  {step.number}
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">
                  {step.title}
                </h3>
                <p className="text-xl opacity-70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
