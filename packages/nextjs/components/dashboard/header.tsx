"use client";

import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { SwitchTheme } from "~~/components/SwitchTheme";
import PrivyConnectButton from "~~/components/scaffold-eth/PrivyConnectButton/PrivyConnectButton";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const { address: connectedAddress } = useAccount();

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Ethernia logo" className="cursor-pointer" fill src="/favicon.png" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">ETHERNIA</span>
            <span className="text-xs">Digital Inheritance</span>
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
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          {/* <HeaderMenuLinks /> */}
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
      <span className="mr-2"><SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} /></span>
      <span className="mr-2"><Address address={connectedAddress} /></span>
      <span className="mr-2"><PrivyConnectButton /></span>
      {/* <RainbowKitCustomConnectButton /> */}
      <span>  {isLocalNetwork && <FaucetButton />}</span>
      </div>
    </div>
  );
};
