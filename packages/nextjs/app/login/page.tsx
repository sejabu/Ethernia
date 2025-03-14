'use client';

import type { NextPage } from "next";
import { LanguageProvider } from "~~/lib/i18n/LanguageContext";
import Header from "~~/components/landingpage/header";
import Login from "~~/components/login/login";

const LoginPage: NextPage = () => {
 
  return (
    <LanguageProvider>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Login />
      </main>
    </div>
    </LanguageProvider>   
  );
};

export default LoginPage;