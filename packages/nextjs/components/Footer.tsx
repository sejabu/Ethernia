import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer>
      <div className="border-t">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col justify-between">
            <Link href="/" passHref className="flex items-center gap-5 mr-6 shrink-0">
              <div className="flex relative w-10 h-10">
                <Image alt="Ethernia logo" className="cursor-pointer" fill src="/favicon.png" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">ETHERNIA</span>
                <span className="text-xs">Digital Inheritance</span>
              </div>
            </Link>
            <p className="text-xs ">
              Crypto inheritance made easy!
            </p>
          </div>
          
          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary">Documentation</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Help Center</Link></li>
            </ul>
          </div>

          <div className="justify-between items-center">
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaDiscord size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>
        </div>
        </div>

        <div className="container mx-auto mt-2 text-left text-sm">
          <p>&copy; {new Date().getFullYear()} ETHERNIA. Made with ❤ for the Scroll Open Hackaton.</p>
        </div>
      
    </footer>
  );
}





// import React from "react";
// import Link from "next/link";
// import { hardhat } from "viem/chains";
// import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { HeartIcon } from "@heroicons/react/24/outline";
// import { SwitchTheme } from "~~/components/SwitchTheme";
// import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
// import { Faucet } from "~~/components/scaffold-eth";
// import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
// import { useGlobalState } from "~~/services/store/store";

// /**
//  * Site footer
//  */
// export const Footer = () => {
//   const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
//   const { targetNetwork } = useTargetNetwork();
//   const isLocalNetwork = targetNetwork.id === hardhat.id;

//   return (
//     <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
//       <div>
//         <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
//           <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
//             {nativeCurrencyPrice > 0 && (
//               <div>
//                 <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
//                   <CurrencyDollarIcon className="h-4 w-4" />
//                   <span>{nativeCurrencyPrice.toFixed(2)}</span>
//                 </div>
//               </div>
//             )}
//             {isLocalNetwork && (
//               <>
//                 <Faucet />
//                 <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1">
//                   <MagnifyingGlassIcon className="h-4 w-4" />
//                   <span>Block Explorer</span>
//                 </Link>
//               </>
//             )}
//           </div>
//           <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
//         </div>
//       </div>
//       <div className="w-full">
//         <ul className="menu menu-horizontal w-full">
//           <div className="flex justify-center items-center gap-2 text-sm w-full">
//             <div className="text-center">
//               <a href="https://github.com/scaffold-eth/se-2" target="_blank" rel="noreferrer" className="link">
//                 Fork me
//               </a>
//             </div>
//             <span>·</span>
//             <div className="flex justify-center items-center gap-2">
//               <p className="m-0 text-center">
//                 Built with <HeartIcon className="inline-block h-4 w-4" /> at
//               </p>
//               <a
//                 className="flex justify-center items-center gap-1"
//                 href="https://buidlguidl.com/"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <BuidlGuidlLogo className="w-3 h-5 pb-1" />
//                 <span className="link">BuidlGuidl</span>
//               </a>
//             </div>
//             <span>·</span>
//             <div className="text-center">
//               <a href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA" target="_blank" rel="noreferrer" className="link">
//                 Support
//               </a>
//             </div>
//           </div>
//         </ul>
//       </div>
//     </div>
//   );
// };
