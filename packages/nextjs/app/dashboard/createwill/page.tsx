import { Suspense } from 'react';
import CreateWill from "~~/components/dashboard/create-will";

export default function CreateWillPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <CreateWill />
            </div>
        </Suspense>
    );
}