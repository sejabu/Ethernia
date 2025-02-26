import { CA } from "@arcana/ca-sdk";
import type { EthereumProvider } from "./typings";

const ca = new CA();

const getCA = async () => {
  if (ca === null) {
    throw new Error("CA not initialized");
  }
  return ca;
};

const initCA = async (provider: EthereumProvider) => {
  ca.setEVMProvider(provider);
  await ca.init();
};

export { getCA, initCA };