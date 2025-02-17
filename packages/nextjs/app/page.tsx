"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowRightIcon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { lusitana } from '~~/components/fonts';
import Image from 'next/image';

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      {/* <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex min-h-screen flex-col p-6">
        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-0 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <p className={`font-bold antialiased text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
              Welcome to Ethernia.
            </p>
            <p className={`${lusitana.className} antialiased text-xl text-gray-800 md:text-2xl md:leading-normal`}> Your digital inheritance platform.</p>
            <p> Leave your family the gift of a lifetime, set your family up for life with a secure inheritance plan for your digital assets.
            </p>
                           
            <Link
              href="dashboard"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
            <span>Start</span>
            <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
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
      </div>      
    </>
  );
};

export default Home;


// export default function Page() {
//   const { targetNetwork } = useTargetNetwork();
//   const isLocalNetwork = targetNetwork.id === hardhat.id;
//   return (
//     <main className="flex min-h-screen flex-col p-6">
//       {/* <div className={styles.shape} /> */}
//       {/* <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"/> */}
//       <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
//         <AcmeLogo />
//       </div>
      
//       <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
//         <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
//           <p className={`${lusitana.className} antialiased text-xl text-gray-800 md:text-3xl md:leading-normal`}>
//           <strong>Welcome to Ethernia.</strong>
//           </p>
//           <p> Your digital inheritance platform.
//           </p>
//           <div className="navbar-end flex-grow mr-4">
//             <RainbowKitCustomConnectButton />
//             {isLocalNetwork && <FaucetButton />}
//           </div>
//           <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
                
//           {/* <Link
//             href="v2/login"
//             className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
//           >
//             <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
//           </Link> */}
//         </div>
//         <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
//           {/* Add Hero Images Here */}
//           <Image
//             src="/hero-desktop.png"
//             width={1000}
//             height={760}
//             className="hidden md:block"
//             alt="Screenshots of the dashboard project showing desktop version"
//           />
//           <Image
//           src="/hero-mobile.png"
//           width={560}
//           height={620}
//           className="block md:hidden"
//           alt="Screenshots of the dashboard project showing mobile version"
//         />
//         </div>
//       </div>
      
//     </main>
//   );
// }
