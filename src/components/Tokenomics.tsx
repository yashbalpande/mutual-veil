import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const tokens = [
  {
    name: "GOV Token",
    symbol: "$MUTL",
    description:
      "Governance, staking, and revenue share. Vote on protocol parameters, reserve ratios, and pool deployments.",
    supply: "100M",
  },
  {
    name: "POOL Shares",
    symbol: "LP-POOL",
    description:
      "Represent capital share of risk pools. Earn premium yield minus reserves. Transferable and stakeable.",
    supply: "Dynamic",
  },
  {
    name: "Cover NFTs",
    symbol: "COVER",
    description:
      "Individual policy slices as ERC-1155 tokens. Enable secondary markets and fractional insurance products.",
    supply: "Unlimited",
  },
];

export const Tokenomics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      <motion.div style={{ y }} className="max-w-7xl mx-auto">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-sm tracking-[0.3em] uppercase font-light">
              Tokenomics
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold max-w-3xl"
          >
            Three-Token Architecture
          </motion.h2>
        </div>

        <div className="space-y-px">
          {tokens.map((token, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-t border-foreground py-12 group hover:bg-foreground hover:text-background transition-colors"
            >
              <div className="grid md:grid-cols-12 gap-8 items-center px-8">
                <div className="md:col-span-2">
                  <div className="text-6xl font-bold opacity-20 group-hover:opacity-30">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-3xl font-bold mb-2">{token.name}</h3>
                  <div className="text-sm opacity-70">{token.symbol}</div>
                </div>
                <div className="md:col-span-5">
                  <p className="text-lg leading-relaxed">{token.description}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <div className="text-sm uppercase tracking-wider opacity-70 mb-1">
                    Supply
                  </div>
                  <div className="text-2xl font-bold">{token.supply}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 grid md:grid-cols-3 gap-px bg-border"
        >
          {[
            {
              label: "Premium Distribution",
              value: "70% Pools / 20% Reserves / 10% Treasury",
            },
            {
              label: "Governance Threshold",
              value: "1% Supply to Propose",
            },
            {
              label: "Reinsurance Trigger",
              value: "80% Pool Utilization",
            },
          ].map((item, i) => (
            <div key={i} className="bg-background p-8">
              <div className="text-sm uppercase tracking-wider mb-3 opacity-70">
                {item.label}
              </div>
              <div className="text-xl font-bold">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
