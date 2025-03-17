"use client";

import { LanguageProvider } from "~~/lib/i18n/LanguageContext";
import Header from "~~/components/landingpage/header";
import Terms from "~~/components/Terms";


export default function TermsPage() {
  return (
    <main>
        <LanguageProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-col justify-center space-x-4 mt-24 w-3/4 mx-auto">
                    <Terms />
                </div>
            </div>
        </LanguageProvider>   
    </main>
  );
}
