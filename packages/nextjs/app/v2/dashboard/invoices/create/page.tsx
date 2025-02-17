import Form from '~~/app/v2/ui/invoices/create-form';
import Breadcrumbs from '~~/app/v2/ui/invoices/breadcrumbs';
import { fetchCustomers } from '~~/app/v2/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Invoice',
};
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/v2/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/v2/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}