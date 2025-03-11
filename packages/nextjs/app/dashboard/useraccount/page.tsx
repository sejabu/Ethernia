import { Suspense } from 'react';
import UserAccount from "~~/components/dashboard/user-account";

export default function AccountPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <UserAccount />
            </div>
        </Suspense>
    );
}