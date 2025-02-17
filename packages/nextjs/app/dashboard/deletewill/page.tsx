import { Suspense } from 'react';
import DeleteWill from "~~/components/dashboard/delete-will";

export default function DeleteWillPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <DeleteWill />
            </div>
        </Suspense>
    );
}
