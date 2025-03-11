import { Suspense } from 'react';
import ClaimWill from "~~/components/dashboard/claim-will";

export default function ClaimPage () {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <ClaimWill />
            </div>
        </Suspense>
    );
}