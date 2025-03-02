import { motion } from "framer-motion";
import { Shield, Key, Clock, Wallet, ScrollText, Hand, Check, HeartPulse } from "lucide-react";
// replace all cards with daisyui class card
import { Card, CardContent } from "~~/components/ui/card";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Wallet,
      titleKey: 'features.cards.connect.title',
      descriptionKey: 'features.cards.connect.description',
    },
    {
      icon: ScrollText,
      titleKey: 'features.cards.will.title',
      descriptionKey: 'features.cards.will.description',
    },
    {
      icon: HeartPulse,
      titleKey: 'features.cards.lifeproof.title',
      descriptionKey: 'features.cards.lifeproof.description',
    },
    {
      icon: Check,
      titleKey: 'features.cards.finish.title',
      descriptionKey: 'features.cards.finish.description',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div className="flex-1 flex flex-column"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card>
                <CardContent className="pt-6">
                  
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                  
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}