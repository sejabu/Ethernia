import { Suspense } from "react";
import AlchemyTokenList from "~~/components/dashboard/alchemy";

export default function AlchemyTokenListPage() {
    return (
            <main className="min-h-screen">
                <Suspense fallback={<div>Loading...</div>}>
                <AlchemyTokenList />
                </Suspense>
            </main>
        
    );
}