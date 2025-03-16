import Link from "next/link";
import Image from 'next/image';
import { LuArrowRight } from "react-icons/lu";
import { motion } from "framer-motion";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hero-content flex-col lg:flex-row-reverse"
        >
        <Image
          src="/ethernia-desktop.png"
          width={1000}
          height={760}
          className="hidden md:block max-h-full object-contain max-w-sm rounded-lg shadow-2xl"
          alt="Screenshots of the Ethernia dashboard project showing desktop version"
          priority
        />
        <Image
          src="/ethernia-mobile.png"
          width={560}
          height={620}
          className="block md:hidden max-h-sm rounded-lg shadow-2xl mt-24"
          alt="Screenshots of the Ethernia dashboard project showing mobile version"
        />
    
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text  mb-6">
            {t('hero.title')}
          </h1>
          <h2 className="text-4xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text  mb-6">
            {t('hero.subtitle0')}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t('hero.subtitle1')}
          </p>
          <div className="flex flex-row gap-4">
            <Link href="dashboard" className="btn btn-primary w-36 text-base text-center">
              {t('hero.demo')}
            </Link>
            <Link href="dashboard/createwill" className="btn w-36 text-base text-center">
              {t('hero.learnmore')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}