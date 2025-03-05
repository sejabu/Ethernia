'use client'
 
import { useState, useEffect } from 'react'
// import CardWrapper from '~~/app/v2/ui/dashboard/cards';
// import RevenueChart from '~~/app/v2/ui/dashboard/revenue-chart';
// import LatestInvoices from '~~/app/v2/ui/dashboard/latest-invoices';
// import { lusitana } from '~~/app/v2/ui/fonts';
import { Suspense } from 'react';
// import { 
//   RevenueChartSkeleton,
//   LatestInvoicesSkeleton,
//   CardsSkeleton,
// } from '~~/app/v2/ui/skeletons';


// import { Metadata } from 'next';
 
// export const metadata: Metadata = {
//    title: 'Dashboard',
// };

 
// export default async function Page() {
//   return (
//     <main>
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Dashboard
//       </h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         <Suspense fallback={<CardsSkeleton />}>
//           <CardWrapper />
//         </Suspense>
//       </div>
//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
//         <Suspense fallback={<RevenueChartSkeleton />}>
//           <RevenueChart />
//         </Suspense>
//         <Suspense fallback={<LatestInvoicesSkeleton />}>
//           <LatestInvoices />
//         </Suspense>
//       </div>
//     </main>
//   );
// }

import Status from "~~/components/dashboard/status";



export default function StatusPage() {
    return (
        <main className="min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
            <Status />
            </Suspense>
        </main>      
    )
}