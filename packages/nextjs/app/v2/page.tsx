"use client";

import AcmeLogo from '~~/app/v2/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// import styles from '@/app/ui/home.module.css';
import { lusitana } from '~~/app/v2/ui/fonts';
import Image from 'next/image';
import { Metadata } from 'next';
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { hardhat } from "viem/chains";
import { SwitchTheme } from "~~/components/SwitchTheme";

 
// export const metadata: Metadata = {
//   title: 'Welcome',
// };



export default function Page() {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* <div className={styles.shape} /> */}
      {/* <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"/> */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} antialiased text-xl text-gray-800 md:text-3xl md:leading-normal`}>
          <strong>Welcome to Ethernia.</strong>
          </p>
          <p> Your digital inheritance platform.
          </p>
          <div className="navbar-end flex-grow mr-4">
            <RainbowKitCustomConnectButton />
            {isLocalNetwork && <FaucetButton />}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
                
          {/* <Link
            href="v2/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link> */}
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
          src="/hero-mobile.png"
          width={560}
          height={620}
          className="block md:hidden"
          alt="Screenshots of the dashboard project showing mobile version"
        />
        </div>
      </div>
      
    </main>
  );
}
