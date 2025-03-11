import { Suspense } from "react";
import Arcana from "~~/components/dashboard/arcana";

export default function ArcanaDemoPage() {
    return (
            <main className="min-h-screen">
                <Suspense fallback={<div>Loading...</div>}>
                <Arcana />
                </Suspense>
            </main>
        
    );
}