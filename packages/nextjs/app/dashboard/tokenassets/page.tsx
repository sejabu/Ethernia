import { Suspense } from 'react';
import Assets from "~~/components/dashboard/assets";

export default function AssetsPage () {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <Assets />
            </div>
        </Suspense>
    );
}