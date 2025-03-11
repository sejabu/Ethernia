"use client";

import { useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";

const PrivyLogin: NextPage = () => {
  const { login, logout } = usePrivy();
  const { ready, wallets } = useWallets();

  const connectedAddress = useMemo(() => {
    if (!ready) return "";
    if (!wallets.length) return "";
    else return wallets[0].address;
  }, [ready, wallets]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2 with privy.io</span>
          </h1>
          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={() => login()}>
              Login{" "}
            </button>
            <button className="btn btn-secondary" onClick={() => logout()}>
              Logout {/* Only works with email logouts */}
            </button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/components/Header.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Make sure you delete the{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              RainbowKitCustomConnectButton and the FaucetButton components
            </code>
            there
          </p>
          <p className="text-center text-lg">
            Copy how the is implemented in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/privy-login/page.tsx
            </code>{" "}
            into the{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/components/Header.tsx
            </code>{" "}
            file
          </p>
          <p className="text-center text-lg">
            Remember to get your own{" "}
            <a href="https://www.privy.io/" className="underline bold">
              Privy API key from their dashboard
            </a>
            and input into{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/components/PrivyScaffoldProvider.tsx
            </code>{" "}
            using the{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              NEXT_PUBLIC_PRIVY_API_KEY
            </code>{" "}
            variable in your{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              .env.local
            </code>{" "}
            file
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivyLogin;
