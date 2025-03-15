'use client';

import type { NextPage } from "next";
import { LanguageProvider } from "~~/lib/i18n/LanguageContext";
import Header from "~~/components/landingpage/header";
import SignUp from "~~/components/signup/signup";

const SignUpPage: NextPage = () => {
 
  return (
    <LanguageProvider>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SignUp />
      </main>
    </div>
    </LanguageProvider>   
  );
};

export default SignUpPage;