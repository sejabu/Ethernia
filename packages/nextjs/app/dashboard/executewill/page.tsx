import { Suspense } from 'react';
import ExecuteWill from "~~/components/dashboard/execute-will";

export default function ClaimPage () {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <ExecuteWill />
            </div>
        </Suspense>
    );
}