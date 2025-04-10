import { Suspense } from 'react';
import ClaimWill from "~~/components/dashboard/claim-will";

export default function ClaimPage () {
    return (
        <Suspense fallback={
            <div className='flex justify-center h-screen space-x-4'>
                <span className="loading loading-bars loading-xs"></span>
                <span className="loading loading-bars loading-sm"></span>
                <span className="loading loading-bars loading-md"></span>
                <span className="loading loading-bars loading-lg"></span>
                <span className="loading loading-bars loading-xl"></span>
            </div>
        }>
            <div className="min-h-screen">
                <ClaimWill />
            </div>
        </Suspense>
    );
}