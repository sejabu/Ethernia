"use client";

import { useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import type { NextPage } from "next";


const PrivyConnectButton: NextPage = () => {
  const { login, logout } = usePrivy();
  const { ready, wallets } = useWallets();

  const connectedAddress = useMemo(() => {
    if (!ready) return "";
    if (!wallets.length) return "";
    else return wallets[0].address;
  }, [ready, wallets]);

  return (
    <>
      <div className="flex flex-row flex-grow">
          <button className="btn btn-primary btn-sm mr-2" onClick={() => login()}>
            Login{" "}
          </button>
         <button className="btn btn-error btn-sm" onClick={() => logout()}>
            Logout {/* Only works with email logouts */}
          </button>
        </div>
    </>
  );
};

export default PrivyConnectButton;
