import { Suspense } from 'react';
import Successors from "~~/components/dashboard/successors";

export default function SuccessorsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <Successors />
            </div>
        </Suspense>
    );
}