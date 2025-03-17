"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { LuGlobe } from "react-icons/lu";
import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Header() {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const { t, language, setLanguage } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="relative">
      {/* Mobile menu */}
      <div className="block md:hidden">
        <div className="dropdown-content menu bg-base-100 rounded-box z-10 w-56 p-2 shadow-sm">
          <ul className="space-y-2">
            <li>
              <a onClick={() => {
                scrollToSection('features');
                onClick?.();
                }} 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
              {t('nav.features')}
              </a>
            </li>
            <li>
              <a onClick={() => {
              scrollToSection('security');
              onClick?.();
              }} 
              className="text-sm font-medium hover:text-primary transition-colors"
              >
              {t('nav.security')}
              </a>
            </li>
            <li>
              <a onClick={() => {
                scrollToSection('pricing');
                onClick?.();
                }} 
              className="text-sm font-medium hover:text-primary transition-colors"
              >
              {t('nav.pricing')}
              </a>
            </li>
            <li>
              <a onClick={() => {
                scrollToSection('about');
                onClick?.();
              }} 
              className="text-sm font-medium hover:text-primary transition-colors"
              >
              {t('nav.about')}
              </a>
            </li>
            <li>
              <a onClick={() => {
                scrollToSection('faq');
                onClick?.();
              }} 
              className="text-sm font-medium hover:text-primary transition-colors"
              >
              {t('nav.faq')}
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Desktop menu */}
    <ul className="hidden md:flex menu menu-horizontal rounded-box">
      <li>
        <a
          onClick={() => {
            scrollToSection('features');
            onClick?.();
          }}
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {t('nav.features')}
        </a>
      </li>
      <li>
        <a onClick={() => {
          scrollToSection('security');
          onClick?.();
          }} 
        className="text-sm font-medium hover:text-primary transition-colors"
        >
        {t('nav.security')}
        </a>
      </li>
      <li>
        <a onClick={() => {
          scrollToSection('pricing');
          onClick?.();
          }} 
          className="text-sm font-medium hover:text-primary transition-colors"
        >
        {t('nav.pricing')}
        </a>
      </li>
      <li>
        <a onClick={() => {
          scrollToSection('about');
          onClick?.();
          }} 
          className="text-sm font-medium hover:text-primary transition-colors"
        >
        {t('nav.about')}
        </a>
      </li>
      <li>
        <a onClick={() => {
          scrollToSection('faq');
          onClick?.();
          }} 
          className="text-sm font-medium hover:text-primary transition-colors"
        >
        {t('nav.faq')}
        </a>
      </li>
    </ul>
  </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" passHref className="hidden md:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Ethernia logo" className="cursor-pointer" fill src="/favicon.png" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold leading-tight">ETHERNIA</span>
            <span className="text-xs">Digital Inheritance Made Easy!</span>
          </div>
        </Link>
        <Link href="/" passHref className="md:hidden flex items-center gap-2 ml-2 mr-6 shrink">
          <div className="flex relative w-10 h-10">
            <Image alt="Ethernia logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold leading-tight"></span>
            <span className="text-xs"></span>
          </div>
        </Link>
        <div className="flex items-center gap-4 navbar-end flex-grow mr-4">
          <nav className="hidden md:flex gap-6">
            <NavLinks />
          </nav>
          <div className="dropdown">
            <div tabIndex={0} role="button">
              <LuGlobe className="h-5 w-5" />
            </div>
            
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-26 p-2 shadow-sm">
              <li>
                <a onClick={() => setLanguage("en")} className={language === "en" ? "bg-primary/10" : ""}>
                English
                </a>
              </li>
              <li>
                <a onClick={() => setLanguage("es")} className={language === "es" ? "bg-primary/10" : ""}>
                Español
                </a>  
              </li>
            </ul>
          </div>      
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>  
      </div>      
    </header>
  );
}