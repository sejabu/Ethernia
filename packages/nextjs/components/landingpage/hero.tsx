import Link from "next/link";
import Image from 'next/image';
import { lusitana } from '~~/components/fonts';
import { ArrowRightIcon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text  mb-6">
            {t('hero.title')}
          </h1>
          <h2 className="text-4xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text  mb-6">
            {t('hero.subtitle0')}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t('hero.subtitle1')}
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <Link href="dashboard" className="btn btn-primary w-36 text-base text-center">
              {t('hero.demo')}
            </Link>
            <Link href="dashboard" className="btn w-36 text-base text-center">
              {t('hero.learnmore')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 relative"
        >
          <div className="flex min-h-screen flex-col p-6">
        <div className="aspect-[3/1] mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-0 rounded-lg px-6 py-10 md:w-2/5 md:px-20">
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">{t('hero.imagecontext')}</p>
                           
            <Link href="dashboard" className="btn btn-primary text-base">
            <span>{t('hero.demo')}</span>
            <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden flex justify-center">
          <Image
             src="/ethernia-desktop.png"
             width={1000}
             height={760}
             className="hidden md:block max-h-full object-contain"
             alt="Screenshots of the Ethernia dashboard project showing desktop version"
             priority
            />
            <Image
              src="/ethernia-mobile.png"
              width={560}
              height={620}
              className="block md:hidden"
              alt="Screenshots of the Ethernia dashboard project showing mobile version"
            />
          </div>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}