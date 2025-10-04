import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const components = [
  {
    title: "Risk Pools",
    description:
      "Separate smart-contract pools per risk type, geography, and term. Contributors earn yield from premiums while managing exposure.",
    icon: "01",
  },
  {
    title: "Premium Engine",
    description:
      "Dynamic formulas and oracles set time-varying premiums based on real-time exposures and risk metrics.",
    icon: "02",
  },
  {
    title: "Claims Oracle",
    description:
      "Parametric oracles from satellites, weather APIs, and payment processors submit signed events for automatic verification.",
    icon: "03",
  },
  {
    title: "Payout Engine",
    description:
      "Smart contracts execute automatic payouts when oracle thresholds are met, eliminating manual claims processing.",
    icon: "04",
  },
  {
    title: "Governance DAO",
    description:
      "Token-based voting controls coverage parameters, reserve allocations, reinsurance purchases, and dispute resolution.",
    icon: "05",
  },
  {
    title: "Privacy Layer",
    description:
      "Zero-knowledge proofs protect sensitive participant data while maintaining verifiable claims and compliance.",
    icon: "06",
  },
];

export const CoreComponents = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ y }}
          className="mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-sm tracking-[0.3em] uppercase font-light">
              Core Components
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold max-w-3xl"
          >
            Infrastructure Built for Trust
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {components.map((component, i) => (
            <ComponentCard key={i} component={component} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ComponentCard = ({
  component,
  index,
}: {
  component: (typeof components)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-background p-8 md:p-12 relative overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 bg-foreground"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />

      <div className="relative z-10">
        <motion.div
          className="text-8xl font-bold mb-6 opacity-10 group-hover:opacity-20 transition-opacity"
          animate={{ color: isHovered ? "#fff" : "#000" }}
        >
          {component.icon}
        </motion.div>

        <motion.h3
          className="text-2xl font-bold mb-4"
          animate={{ color: isHovered ? "#fff" : "#000" }}
        >
          {component.title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground leading-relaxed"
          animate={{ color: isHovered ? "#fff" : "hsl(var(--muted-foreground))" }}
        >
          {component.description}
        </motion.p>
      </div>
    </motion.div>
  );
};
