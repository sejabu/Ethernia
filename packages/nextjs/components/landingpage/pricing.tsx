import { motion } from "framer-motion";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { ArrowRightIcon, Check } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

const plans = [
  {
    name: "Free",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get benefits. ",
    ],
  },
  {
    name: "Free Plus",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get benefits. ",
    ],
  },
  {
    name: "Subscription",
    price: "0.00",
    features: [
      "Try our Demo.",
      "Register for free.",
      "Join us for testing & get benefits. ",
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
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="dashboard"
                    className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                    <span>{t('hero.demo')}</span>
                    <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}