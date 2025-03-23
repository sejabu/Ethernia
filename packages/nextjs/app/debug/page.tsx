import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <div className="flex flex-row flex-wrap justify-between text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Ethernia Debug Contracts Page</h1>
        <Link href="/dashboard" className="btn">Return to Dashboard</Link> 
      </div>
      <DebugContracts />
    </>
  );
};

export default Debug;
