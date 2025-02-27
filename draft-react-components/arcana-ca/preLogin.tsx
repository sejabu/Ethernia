"use client";

import { useEffect, useState } from 'react';
import { initCA } from "~~/utils/getCA";
import { type EthereumProvider } from '~~/utils/typings';

interface PreLoginProps {
  connect: () => void;
}

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EthereumProvider;
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider";
  detail: EIP6963ProviderDetail;
}

const PreLogin: React.FC<PreLoginProps> = ({ connect }) => {
  const [providers, setProviders] = useState<Array<EIP6963ProviderDetail>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectingMsg, setConnectingMsg] = useState<string>("");

  const onAnnouncement = (event: Event) => {
    const eipEvent = event as EIP6963AnnounceProviderEvent;
    
    if (providers.map(p => p.info.uuid).includes(eipEvent.detail.info.uuid)) return;
    
    setProviders(prevProviders => [...prevProviders, eipEvent.detail]);
    
    const lastConnectedWallet = localStorage.getItem("xar-casdk-last-connected-wallet");
    if (!lastConnectedWallet) {
      setLoading(false);
      return;
    }
    
    if (eipEvent.detail.info.rdns === lastConnectedWallet) {
      connectWallet(eipEvent.detail);
    }
    
    console.log({ providers });
  };

  useEffect(() => {
    window.addEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    
    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    };
  }, []);

  const connectWallet = async (p: EIP6963ProviderDetail) => {
    console.log(p.provider, loading);
    setLoading(true);
    setConnectingMsg(`Connecting to ${p.info.name}`);
    console.log({ loading });
    
    try {
      const accounts = await p.provider.request({ method: "eth_requestAccounts" }) as string[];
      await initCA(p.provider);
      localStorage.setItem("xar-casdk-last-connected-wallet", p.info.rdns);
      connect();
      console.log("Connected. Account:", accounts[0]);
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      console.log("reached finally");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[347px] min-w-[282px] mx-auto max-w-1/6 flex flex-col justify-center align-center border border-gray-200 rounded-lg shadow p-10">
      {loading ? (
        <div className="flex flex-col justify-center align-center text-center">
          <div className="flex justify-center align-center text-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>
          {connectingMsg && (
            <h5 className="mt-4 font-bold leading-none text-gray-900 dark:text-white">{connectingMsg}</h5>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Wallets
          </h2>
          <hr className="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700" />
          {providers.map((p) => (
            <div key={p.info.uuid} className="mx-auto flex justify-center align-center mb-2">
              <button
                type="button"
                onClick={() => connectWallet(p)}
                className="w-48 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500"
              >
                <img src={p.info.icon} className="w-4 h-4 me-2 -ms-1 text-[#626890]" aria-hidden="true" />
                {p.info.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export {PreLogin};