import { Suspense } from 'react';
import Lifeproof from "~~/components/dashboard/lifeproof";

export default function LifeProofPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <Lifeproof />
            </div>
        </Suspense>
    );
}