import { motion } from "framer-motion";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import Link from "next/link";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

const plans = [
  {
    name: "Free",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get early access.",
    ],
  },
  {
    name: "Free Plus",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get early access.",
    ],
  },
  {
    name: "Subscription",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get early access.",
    ],
  },
];

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include our core security features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="card w-96 bg-base-100 shadow-sm">
                <div className="card-body">
                  <span className="badge badge-xs badge-warning">Most Popular</span>
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{plan.name}/month</h2>
                    <span className="text-xl">${plan.price}</span>
                  </div>
                  <ul className="mt-6 flex flex-col gap-2 text-xs">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <LuCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="dashboard" className="btn btn-primary text-base">
                      <span>{t('hero.demo')}</span>
                      <LuArrowRight className="w-5 md:w-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}