import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reasons = [
  "Transparent smart contracts",
  "Easy to set up and manage",
  "Privacy guaranteed; no personal data required",
  "User-friendly interface",
  "Affordable prices",
  "No external human intervention needed",
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/ethernia-hand.jpg"
              alt="Man using Ethernia DApp in his phone"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose us?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We combine cutting-edge technology with ease of use to provide the best crypto inheritance solution.
            </p>
            <ul className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <Check className="text-primary w-5 h-5" />
                  <span>{reason}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>  
        </div>
        <div className="navbar bg-base-300 mt-8 h-10 justify-center ">
            <span className="text-xl">Questions? Read our&nbsp;&nbsp;<button className="btn text-xl">FAQs section</button>&nbsp;&nbsp;or&nbsp;&nbsp;<button className="btn text-xl">Contact us</button>&nbsp;</span>
            
        </div>
      </div>
    </section>
  );
}