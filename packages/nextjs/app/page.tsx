"use client";

import type { NextPage } from "next";
import { LanguageProvider } from "~~/lib/i18n/LanguageContext";
import Header from "~~/components/landingpage/header";
import Hero from "~~/components/landingpage/hero";
import Features from "~~/components/landingpage/features";
import Security from "~~/components/landingpage/security";
import WhyChooseUs from "~~/components/landingpage/whyChooseUs";
import Pricing from "~~/components/landingpage/pricing";
import AboutUs from "~~/components/landingpage/aboutUs";
import FAQ from "~~/components/landingpage/faqs"


const Home: NextPage = () => {
 
  return (
    <LanguageProvider>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Security />
        <WhyChooseUs />
        <Pricing />
        <AboutUs />
        <FAQ />
      </main>
    </div>
    </LanguageProvider>   
  );
};

export default Home;

