import { motion } from "framer-motion";
import { Button } from "./ui/button";

export const CTA = () => {
  return (
    <section className="py-32 px-6 bg-foreground text-background">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-none">
            Join the Mutual
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-70 max-w-3xl mx-auto leading-relaxed">
            Participate in the future of decentralized insurance. Pool capital,
            purchase coverage, or help govern the protocol.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform border-background text-background hover:bg-background hover:text-foreground"
            >
              Launch dApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform border-background text-background hover:bg-background hover:text-foreground"
            >
              Read Whitepaper
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-background/20">
            {[
              { label: "Discord", value: "Join Community" },
              { label: "GitHub", value: "View Source" },
              { label: "Docs", value: "Read Documentation" },
            ].map((link, i) => (
              <motion.a
                key={i}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="text-sm uppercase tracking-wider mb-2 opacity-50">
                  {link.label}
                </div>
                <div className="text-lg font-bold group-hover:translate-x-2 transition-transform inline-block">
                  {link.value} →
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
